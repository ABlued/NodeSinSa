import React, { useEffect, useState } from 'react'
import { FaCode } from "react-icons/fa";
import axios from "axios"
import { Icon, Col, Card, Row, Carousel} from 'antd';
import Meta from 'antd/lib/card/Meta';
import ImageSlider from '../../utils/ImageSlider'
import CheckBox from '../LandingPage/Sections/CheckBox'
import RadioBox from './Sections/RadioBox'
import SearchFeature from './Sections/SearchFeature'
import { continents, price } from './Sections/Datas'
import './fontello-5d5b4f18/css/fontello-embedded.css'
function LandingPage() {
    const [Products, setProducts] = useState([])
    const [Skip, setSkip] = useState(0)
    const [Limit, setLimit] = useState(8)
    const [PostSize, setPostSize] = useState(0)
    const [Filters, SetFilters] = useState({
        continents : [],
        price: []
    })
    const [SearchTerm, setSearchTerm] = useState("")

    useEffect(() => {

        let body = {
            skip: Skip,
            limit: Limit
        }
        getProducts(body)
    }, [])

    const getProducts = (body) => {
        axios.post('/api/product/products', body)
        .then(response => {
            if(response.data.success){
                // console.log(response.data);
                if(body.loadMore){
                    setProducts([...Products, ...response.data.productInfo]);
                } else {
                    setProducts(response.data.productInfo);
                }
                setPostSize(response.data.postSize);
            } else {
                alert("상품들을 가져오는데 실패 했습니다.")
            }
        })
    }
    const loadMoreHandler = (e) => {
        let skip = Skip + Limit;
        let body = {
            skip: skip,
            limit: Limit,
            loadMore: true
        }
        
        getProducts(body)
        setSkip(skip);
    }

    const renderCards = Products.map((product, index) =>{
        // console.log(product);// Col의 전체크기는 24이다. 창화면이 제일 클때(lg) 사진 하나의 크기를 6으로 맞춰준다(그럼 한 줄에 4장이다.)
                             // 창화면이 보통 일 때(md) 사진 하나의 크기를 8로 맞춰준다(그럼 한 줄에 3장이다.)
                             // 창화면이 제일 작을 때(xs) 사진 하나의 크기를 24로 맞춰준다(그럼 한 줄에 1장이다.)
        return <Col lg={6} md={8} xs={24} key={index}>
            <Card
                key={index}
                cover={<a href={`/product/${product._id}`}>
                <ImageSlider images={product.images}/></a>}
            >
               
                <Meta 
                    title={product.title}
                    description={`${product.price}원`}
                />
            </Card>
        </Col>
    })

    const showFilteredResults = (filters) => {

        let body = {
            skip: 0,
            limit: Limit,
            filters: filters
        }
        getProducts(body)
        setSkip(0)
    }
    const handlePrice = (value) => {
        const data= price;
        let array = [];

        for(let key in data){
            if(data[key]._id === parseInt(value, 10)){
                array = data[key].array;
            }
        }
        return array;
    }
    const handleFilters = (filters, category) => {
        const newFilters = { ...Filters }
        newFilters[category] = filters
        // https://www.inflearn.com/course/%EB%94%B0%EB%9D%BC%ED%95%98%EB%A9%B0-%EB%B0%B0%EC%9A%B0%EB%8A%94-%EB%85%B8%EB%93%9C-%EB%A6%AC%EC%95%A1%ED%8A%B8-%EC%87%BC%ED%95%91%EB%AA%B0/lecture/41262?tab=curriculum&speed=1.25
        // 이 코드의 의미는 이 링크에 3:30 부터 보자
        if(category === "price"){
            let priceValues =  handlePrice(filters)
            newFilters[category] = priceValues
        }
        showFilteredResults(newFilters)
        SetFilters(newFilters)
    }

    const updateSearchTerm = (newSearchTerm) => {
        
        let body = {
            skip: 0,
            limit: Limit,
            filters: Filters,
            searchTerm: newSearchTerm
        }
        
        setSkip(0)
        setSearchTerm(newSearchTerm)
        getProducts(body)
    }

    return (
        <div style={{ width: '75%', margin: '3rem auto'}}>
            <div style={{ textAlign: 'center'}}>
                <h2>옷은 NodeSinSa랑해<i class="icon-heart"></i></h2>
            </div>

            {/* Filter */}
            <Row gutter={[16, 16]}>
                <Col lg={12} xs={24}>
                    {/* CheckBox */}
                    <CheckBox list={continents} handleFilters={filter => handleFilters(filter, "continents")}/>
                </Col>
                <Col lg={12} xs={24}>
                    {/* RadioBox */}
                    <RadioBox list={price} handleFilters={filter => handleFilters(filter, "price")}/>
                </Col>
            </Row>
            

            {/* Search */}
            <div style={{ display:'flex', justifyContent: 'flex-end', margin: '1rem auto'}}>
                <SearchFeature 
                    refreshFunction={updateSearchTerm}
                />
            </div>
            {/* Cards */}
            <Row gutter={16}>
                {renderCards}
            </Row>
            {PostSize >= Limit && 
                <div style={{ display:'flex', justifyContent: 'center'}}>
                    <button onClick={loadMoreHandler}>더보기</button>
                </div>
            }
        </div>
    )
}

export default LandingPage

// Carousei 참고링크 : https://ant.design/components/carousel/ 