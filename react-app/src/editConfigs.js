
export default  {

    text : {
        emptyLabel: 'Text',
        isEmpty: function(props) {
            return !props || !props.text || props.text.trim().length < 1;
        }
    },
    image : {
        emptyLabel: 'Image',
        isEmpty: function(props) {
            return !props || !props.src || props.src.trim().length < 1;
        }
    },

    weather: {
        emptyLabel: 'Weather',

        isEmpty: function(props) {
            return !props.city || props.city.trim().length < 1;
        }
    }




}
