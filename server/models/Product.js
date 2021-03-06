const mongoose = require('mongoose');
const Schema  = mongoose.Schema;

const productSchema = mongoose.Schema({
    writer: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    title: {
        type: String,
        maxlength: 50
    },
    description: {
        type: String,
    },
    price: {
        type: Number,
        default: 0
    },
    images: {
        type: Array,
        default: []
    },
    sold: {
        type: Number,
        maxlength: 100,
        default: 0
    },
    continents:{
        type:String,
        default:''
    },
    views: {
        type: Number,
        default: 0
    }
}, { timestamps: true})
productSchema.index({
    title: 'text',
    description: 'text'
},{
    weights:{
        title: 5,
        description: 1
    }
})
// product을 검색할 때 어떤 항목을 더 중요시할게 볼 때 weigths를 사용한다.
// 링크 참조 : https://docs.mongodb.com/manual/tutorial/control-results-of-text-search/
const Product = mongoose.model('Product', productSchema);

module.exports = { Product }