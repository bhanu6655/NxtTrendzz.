import {useState, useEffect} from 'react'
import {useParams} from 'react-router-dom'

import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {CiSquarePlus, CiSquareMinus} from 'react-icons/ci'
import SimilarProductItem from '../SimilarProductItem'
import Header from '../Header'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  pending: 'PENDING',
}

const ProductItemDetails = () => {
  const [productDetails, setProductDetails] = useState({
    mainProduct: null,
    similarProducts: [],
  })
  const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial)
  const [count, setincrement] = useState(1)

  const {id: productId} = useParams()

  useEffect(() => {
    const getProductDetails = async () => {
      setApiStatus(apiStatusConstants.pending)
      const jwtToken = Cookies.get('jwt_token')
      console.log(jwtToken)

      try {
        const response = await fetch(
          `https://apis.ccbp.in/products/${productId}`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          },
        )

        if (response.ok) {
          const data = await response.json()

          const formattedMainProduct = {
            availability: data.availability,
            brand: data.brand,
            description: data.description,
            id: data.id,
            imageUrl: data.image_url,
            price: data.price,
            rating: data.rating,
            title: data.title,
            totalReviews: data.total_reviews,
          }

          const formattedSimilarProducts = data.similar_products.map(
            product => ({
              availability: product.availability,
              brand: product.brand,
              description: product.description,
              id: product.id,
              imageUrl: product.image_url,
              price: product.price,
              rating: product.rating,
              title: product.title,
              totalReviews: product.total_reviews,
            }),
          )

          setProductDetails({
            mainProduct: formattedMainProduct,
            similarProducts: formattedSimilarProducts,
          })
          setApiStatus(apiStatusConstants.success)
        } else {
          setApiStatus(apiStatusConstants.failure)
        }
      } catch (error) {
        console.error('Fetch error:', error)
        setApiStatus(apiStatusConstants.failure)
      }
    }

    getProductDetails()
  }, [productId])

  const renderLoadingView = () => (
    <div className="products-details-loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height={50} width={50} />
    </div>
  )

  const onFailureview = () => {}

  const renderFailureView = () => (
    <div className="product-details-failure">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="error view"
        className="error-image"
      />
      <h1 className="product-not-found">Product Not Found</h1>
      <button
        className="continue-shopping-button"
        type="button"
        onClick={onFailureview}
      >
        Continue shopping
      </button>
    </div>
  )

  const onIncrement = () => {
    setincrement(prevcount => prevcount + 1)
  }
  const onDecrement = () => {
    setincrement(prevcount => prevcount - 1)
  }

  const renderProductDetailsView = () => {
    const {mainProduct, similarProducts} = productDetails

    return (
      <div>
        <div className="product-details-container">
          <img
            src={mainProduct.imageUrl}
            alt={mainProduct.title}
            className="product-image"
          />
          <div className="product-info">
            <h1 className="product-title">{mainProduct.title}</h1>
            <p className="product-price">Rs {mainProduct.price}/-</p>
            <div className="rating-reviews">
              <div className="rating-section">
                <p className="rating-section">{mainProduct.rating}</p>
                <img
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                  alt="star"
                  className="star-image"
                />
              </div>
              <span className="reviews">
                {mainProduct.totalReviews} Reviews
              </span>
            </div>
            <p className="product-description">{mainProduct.description}</p>
            <p className="availability">
              Available:
              <span className="avalilable"> {mainProduct.availability} </span>
            </p>
            <p className="brand">
              Brand: <span className="brand-name">{mainProduct.brand} </span>
            </p>
            <hr className="horizantal-line" />
            <div className="buttons-section">
              <button type="button" className="buttons">
                <CiSquarePlus className="minus" onClick={onIncrement} />
              </button>
              <p className="count">{count}</p>
              <button type="button" className="buttons" onClick={onDecrement}>
                <CiSquareMinus className="minus" />
              </button>
            </div>
            <button className="add-to-cart-button">ADD TO CART</button>
          </div>
        </div>
        <div className="similar-products-section">
          <h2 className="similar-products-heading">Similar Products</h2>

          <ul className="similar-products-list">
            {similarProducts.map(each => (
              <SimilarProductItem productDetails={each} key={each.id} />
            ))}
          </ul>
        </div>
      </div>
    )
  }

  const renderViews = () => {
    switch (apiStatus) {
      case apiStatusConstants.success:
        return renderProductDetailsView()
      case apiStatusConstants.failure:
        return renderFailureView()
      case apiStatusConstants.pending:
        return renderLoadingView()
      default:
        return null
    }
  }

  return (
    <>
      <Header />
      <div className="product-item-container">{renderViews()}</div>
    </>
  )
}

export default ProductItemDetails
