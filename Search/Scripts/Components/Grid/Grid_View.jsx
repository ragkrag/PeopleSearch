/**
*   <Grid />
*   @class Grid
*   @sampleprops {
        "headers": ["Col1", "Col2", "Col3 (Desktop Only)"],
        "data": [
            {"Col1": "Cell 1", "Col2": "Cell 2", "Col3": "Cell 3"},
            {"Col1": "Cell 4", "Col2": "Cell 5", "Col3": "Cell 6"},
            {"Col1": "Cell 7", "Col2": "Cell 8", "Col3": "Cell 9"}
        ],
        "headers_map": {"Col3": "Col3 (Desktop Only)"},
        "headers_mobileHidden": ["Col3 (Desktop Only)"]
    }
*/
// ===============================================
Grid.View = React.createClass({
    propTypes: {
        /**
        * An array of strings that represent column header text.
        *
        * @property headers
        * @type array (strings)
        * @required
        */
        headers: React.PropTypes.array.isRequired,
        /**
        * Array of data models that will populate the rows and cells of the grid.
        * If the array is empty or is not supplied, the "No Content" message will display.
        *
        * @property data
        * @type array (objects)
        */
        data: React.PropTypes.array,
        /**
        * A dictionary of strings (header text) and their corresponding model property name.
        * This is used to map model properties to the given headers.
        * If no map is provided, the grid will attempt to map the header text directly to the object properties.
        * For example: {'PropertyName': 'Header String'}.
        *
        * @property headers_map
        * @type dictionary (strings)
        */
        headers_map: React.PropTypes.object,
        /**
        * An array of strings that represent columns header which are hidden on mobile viewports.
        *
        * @property headers_mobileHidden
        * @type array (strings)
        */
        headers_mobileHidden: React.PropTypes.array,
        /**
        * An array of strings that represent columns header which are hidden on desktop viewports.
        *
        * @property headers_desktopHidden
        * @type array (strings)
        */
        headers_desktopHidden: React.PropTypes.array,
        /**
        * A string that matches one of the available grid selection behavior types.
        *
        * @property selectType
        * @type string
        * @options single|multi
        * @default single
        */
        selectType: React.PropTypes.oneOf([
                'static',
                'multi',
                'single'
        ]),
        /**
        * A string for the text that displays when no data is given.
        *
        * @property noContentMessage
        * @type string
        * @default 'No Results'
        */
        noContentMessage: React.PropTypes.string,
        /**
        * A boolean for if the rows should be styled with alternate striping.
        *
        * @property zebraRows
        * @type boolean
        * @default false
        */
        zebraRows: React.PropTypes.string,
        /**
        * A callback handler that will be given all currently selected rows and row indeces whenever a change in selection occurs.
        *
        * @property onChange
        * @type function
        */
        onChange: React.PropTypes.func,
        /**
        * If a subrow property exists on the data model, define the name of the property and the header that should render for that row.
        * Example: { Comment: resx.Row_Header_Comment } (PropertyName: HeaderResource).
        *
        * @property subRow_map
        * @type object
        */
        subRow_map: React.PropTypes.object,
        /**
        * Array of numbers that represent the indeces (row numbers) that should be selected.
        *
        * @property selectedIndeces
        * @type array
        */
        selectedIndeces: React.PropTypes.array
    },

    // ----------------------------
    render: function () {
        var headers = this.renderHeaders();
        var rows = this.renderBody();
        var className = 'grid ' + this.props.type;
        if (this.props.zebraRows) className += ' zebra';
        return (
            <table className={className}>

                {/* Grid Header Row */}
                    <tr className='row headers header-table'>
                        {headers}
                    </tr>

                {/* Grid Body*/}
                {rows}
            </table>
        );
    },

    // ----------------------------
    getDefaultProps: function () {
        return {
            headers: [],
            headers_map: {},
            type: 'single',
            data: [],
            noContentMessage: "No Results"
        };
    },

    // ----------------------------
    getInitialState: function () {
        this.headers = (this.props.headers || []).map(h => h);
        var columns = this.mapResponsiveColumns(this.props);

        return {
            columns,
            selectedRowIndeces: this.props.selectedIndeces || []
        };
    },

    // ----------------------------
    componentWillReceiveProps: function (nextProps) {
        this.headers = (nextProps.headers || []).map(h => h);
        var columns = this.mapResponsiveColumns(nextProps);

        // Update the selectedIndeces if a new prop has been given for them.
        var propIndeces = this.props.selectedIndeces || [];
        var nextIndeces = nextProps.selectedIndeces || [];

        var selectedRowIndeces = propIndeces.join('') !== nextIndeces.join('') ?
            nextIndeces :
            this.state.selectedRowIndeces;

        this.setState({
            columns,
            selectedRowIndeces
        });
    },

    // ----------------------------
    renderHeaders: function () {
        var self = this;
        var type = this.props.type;
        var name = this.props.name || '';
        var numSelected = self.state.selectedRowIndeces.length;

        return this.headers.map(function (header, index) {
            return <td key={index} className='cell'>{header}</td>;
        });

    },

    // ----------------------------
    mapResponsiveColumns: function (props) {
        var columns;
        var headers = this.headers;


        // If props have been given to dictate whether some
        // headers are only for desktop or mobile, map into
        // to array for future rendering checks.
        if (props.headers_desktopHidden || props.headers_mobileHidden) {

            // Force to lower case for comparisons.
            var mobileHeaders = (props.headers_desktopHidden || []).map(h => (h || '').toString().toLowerCase());
            var desktopHeaders = (props.headers_mobileHidden || []).map(h => (h || '').toString().toLowerCase());

            // Map into column objects.
            columns = headers.map(function (h) {
                var header = h.toString().toLowerCase();

                var className = '';
                if (mobileHeaders.indexOf(header) > -1) className = 'mobile-only';
                else if (desktopHeaders.indexOf(header) > -1) className = 'desktop-only';

                // Return a new column object.
                return { label: h, className };
            });

        } else {
            // No responsive classes, map all as base.
            columns = headers.map(function (h) {
                return { label: h, className: 'header' }
            });
        }

        return columns;
    },

    // ----------------------------
    renderBody: function () {
        var self = this;
        var data = this.props.data || [];

        // If no data has been provided, display message
        if (!data.length) return this.renderNoContent();

        return data.map((row, index) => self.renderRow(row, index));
    },

    // ----------------------------
    renderRow: function (row, index) {
        var self = this;
        var rowProps = Object.keys(row);
        var rowSelected = this.state.selectedRowIndeces.indexOf(index) > -1;
        var clickHandler = this.props.type !== 'static' ?
            this.selectRow.bind(self, row, index) :
            undefined;

        // Attempt to get a unique key for this row, fallback on index.
        var key = row.Id || row.ID || row.Name || row.Label || index;

        // Map object properties back to column headers.
        var columns = this.state.columns;
        var columnMap = this.props.headers_map;
        var columnKeys = Object.keys(columnMap);
        var rowNode = columns.map(function (c, i) {
            // The added-on Select Cell
            if (c.label === "Select") {
                return self.renderCell(c, row.Select);
            }

            // If a valid column map has been provided, use that.
            // Otherwise, try to map to the base header/object value.
            var prop = columnKeys.filter(k => columnMap[k] === c.label)[0] || c.label;
            var index = columnKeys.indexOf(prop);
            var content = row[prop];

            return self.renderCell(c, content);
        });

        // Get the row classname & if it's currently selected (based on index).
        var className = 'row-group';
        if (rowSelected) className += ' selected';
        // Custom className added to the row

        if (row.RowClassName || row.rowClassName) className += ' ' + row.RowClassName || row.rowClassName;

        var returnRows = [<tr key={key} className='row'>{rowNode}</tr>];
        if (this.props.subRow_map) returnRows.push(this.renderSubRow(key, row));

        return <tbody key={key} className={className} onClick={clickHandler }>{returnRows}</tbody>;
    },

    // ----------------------------
    renderCell: function (header, content) {
        if (header.label === "Image") {
            var imageString = `data:image;base64,${content}`
            var display = <img className='img-stuct' src={imageString} />
        }
        else {
            display = <span>{content}</span>
        }

        return (
        <td key={header.label} className={'cell ' + header.className}>
            <label className='header'>{header.label}</label>
            {display}
        </td>
        );
    },

    // ----------------------------
    renderSubRow: function (key, row) {
        var map = this.props.subRow_map;
        var mapKeys = Object.keys(map);

        var header = map[mapKeys[0]];
        var content = row[mapKeys[0]];

        var multiPlaceholder = null;
        if (content) {
            return (
            <tr key={key + '-sub'} className='row sub'>
                {multiPlaceholder}
                <td colSpan={this.props.headers.length} className='cell'>
                    <label className='header'>{header}</label>
                    <span>{content}</span>
                </td>
            </tr>
        );
        }
    },

    // ----------------------------
    renderNoContent: function () {
        return (
        <tr className='row'>
            <td colSpan={this.state.columns.length} className='cell no-content'>
                {this.props.noContentMessage}
            </td>
        </tr>
    );
    },

    // ----------------------------
    selectRow: function (row, index, event) {
        var self = this;
        if (event.target.className == 'checkbox-label') event.preventDefault();

        var selectedRowIndeces = this.state.selectedRowIndeces;

         // Type: SINGLE
        // -------------------
         var currentIndex = selectedRowIndeces[0];
        selectedRowIndeces = currentIndex != index ? [index] : []

        selectedRowIndeces = selectedRowIndeces.sort();

        this.setState({ selectedRowIndeces });

        this.reportChange(selectedRowIndeces);
    },

    // ----------------------------
    selectAll: function (event) {
        var data = this.props.data || [];
        var allIndeces = [];

        // If all rows are not already selected, select them all.
        // Otherwise, let allIndeces reset to an empty array.
        if (data.length !== this.state.selectedRowIndeces.length) {
            allIndeces = data.map((row, index) => index);
        }

        this.setState({ selectedRowIndeces: allIndeces });

        this.reportChange(allIndeces);
    },

    // ----------------------------
    addSelectedIndex: function (list, index, forceSelect) {

        // Determine if the index already exists in the array.
        var indexIndex = list.indexOf(index);

        if (indexIndex > -1) {
            if (!forceSelect) {
                // Remove the index from the array
                list.splice(indexIndex, 1);
            }

        } else {
            // Add the index to the array
            list.push(index);
        }
    },

    // ----------------------------
    reportChange: function (selectedRowIndeces) {
        if (typeof this.props.onChange === 'function') {
            // Get the actual data objects from our index array.
            var selectedRows = selectedRowIndeces.map(i => this.props.data[i]);

            // Report the selection back to the parent.
            // Send the actual data objects that have been selected.
            this.props.onChange({ selectedRowIndeces, selectedRows });
        }
    }
});