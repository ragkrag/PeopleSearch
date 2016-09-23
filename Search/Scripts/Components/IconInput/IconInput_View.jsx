
/**
*   <IconInput />
*   @class IconInput
*   @sampleprops {"placeholder": "Search"}
*/
// ===============================================

IconInput.View = React.createClass({
    propTypes: {
        /**
        * Icon that displays inside of the input field.
        *
        * @property icon
        * @type string
        * @options search|filter
        * @default search
        */
        icon: React.PropTypes.oneOf([
                'search',
                'filter'
        ]),
        /**
        * Type of input to render.
        *
        * @property type
        * @type string
        * @options text|number|tel etc...
        * @default text
        */
        type: React.PropTypes.string
    },

    // ----------------------------
    render: function () {
        var wrapperClassName = 'icon-input ' + this.props.icon.toLowerCase();
        var {...inputProps} = this.props;
        inputProps.icon = undefined;

        return (
            <div className={wrapperClassName}>
                <input {...inputProps} />
            </div>
        );
    },

    // ----------------------------
    getDefaultProps: function () {
        return {
            icon: 'search',
            type: 'text'
        };
    },
});