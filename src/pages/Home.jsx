import axios from "axios";
import React, { useEffect, useState } from "react";
import "./Home.css";
import { RatingStar } from "rating-star";
import { Rating } from "react-simple-star-rating";
import { useForm } from "react-hook-form";

const Home = () => {
  let token =
    "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiZjJlY2Y0MTZhMjlkM2Y4ZTA3MGFlYmZiNjcyY2ZjODgxYWI5N2E0ZTIxNDljMjQ2NzRkZjMyNmQyMDUzOGYxMWNjOTc5Mzg2ODQ2YTk0MzgiLCJpYXQiOjE2ODEwOTk1MzAuNjU2NjgyLCJuYmYiOjE2ODEwOTk1MzAuNjU2Njg0LCJleHAiOjE3MTI3MjE5MzAuNjA3NTU3LCJzdWIiOiIxMzM3Iiwic2NvcGVzIjpbXX0.mA_qufYow3i7iybUoLNqm7OFyuvla8AyEQMZ2lXs64nBYHAwwIujQxeYt_iSIjE0Aq5OMNnFEU0vTVqanWbAOPK5xyWVYj0L-glqQeAOetOy26JqS8E_Pabgh29l7LK-pHgGKvcdUfxWLAwugRy6D3loON-0WMBHjhXug7DpshEKvUyKCwRbqnFe2PJaCjcGueDIfLOvL_kgKkYVmF3ow5V99ePre-elRVcmKlED0KilRyGPDbAXEXtbFKnyuHzXed7lTFWqAvK4Mij38K8UpJNFb9mG6yViwjFqcJ4b7jQX1Hox_LrI0c-URsy0D8BBu_O7wHdkW__89J6-1OiWeE0x64epWd90ijl57gKfotDWPaOYB3hkG_ho1IufCASMGCYb0DTU9FvcZtOi-mcWBDPbh9fsTIj8vrCqOudqA8N9jHz13KJ-4VFORsdpLmkmfbG925FPDz0nNZM2M6Hnu9ZHWtXZu0HYpcVReKaZY3YE4Jzdg8096TrgQifp1oKEzTyNfzg8plQAlgZ4LM0qNHQECRLyumK03cCXLZb2KrHK_aJSEjmcUiIRgKoOm9cZR_aP5-8-ceY-UggygQRm55ULQ0JnuJyfT7Qbw4FmC9Xl8Ldo6WLSf_-4l2bfrkX8bTfwWN2FZHIESfYJarmEILiWogo4808yJCWxd_DZeLo";
  let id = 7146;
  const [productDetail, setProductDetail] = useState([]);
  useEffect(() => {
    axios
      .get(`https://backend.bppshop.com.bd/api/v1/products/details/${id}`)
      .then((res) => {
        setProductDetail(res.data.data);
      });
  }, [id]);
  
  //for again view reviews after submit comment 
  const getProductsReviewDetails = () => {
    axios
    .get(`https://backend.bppshop.com.bd/api/v1/products/details/${id}`)
    .then((res) => {
      setProductDetail(res.data.data);
    });
  };

  //reverse array of reviews
  const reversedReviews = productDetail?.reviews?.map(
    (_, index, arr) => arr[arr.length - 1 - index]
  );

  //rating functionality
  const { register, handleSubmit, reset } = useForm();
  const [rating, setRating] = useState("");
  const handleRating = (rate) => {
    setRating(rate);
  };
  const onSubmit = (data) => {
    const newData = {
      product_id: id,
      comment: data.comment,
      rating: rating,
    };
    axios
      .post(
        `https://backend.bppshop.com.bd/api/v1/products/reviews/submit`,
        newData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((res) => {
        if (res?.data?.status === "success") {
          reset();
          setRating(rating);
          getProductsReviewDetails();
          document.getElementById("errorMsg").innerText = "";
        }
      })
      .catch((error) => {
        document.getElementById("errorMsg").innerText =
          error.response.data.errors[0].message;
      });
  };

  return (
    <>
      <div className="container">
        <div className="bg-info p-4">
          <h4 className="text-center text-light">
            Customer Review Star Rating And Comment
          </h4>
        </div>
        <div className="row my-2">
          <h2 className="text-center">Customers Review</h2>
          <div className="col-md-6">
            <div className="add_review_product_detail">
              <div>
                <img
                  src={`https://backend.bppshop.com.bd/storage/product/thumbnail/${productDetail?.thumbnail}`}
                  alt=""
                  width={70}
                />
              </div>
            </div>
            <div className="product_name_and_review">
              <b>{productDetail.name}</b>
            </div>
          </div>
          <div className="col-md-6">
            <div className="customer-reviews">
              <div className="averageRating-container">
                <h1>{productDetail?.average_review}</h1>
                <div>
                  <h2>Average Ratings</h2>
                  <RatingStar
                    id={productDetail?.id}
                    rating={productDetail?.average_review}
                  />
                  {/* <p className="rating-star">
                      {(() => {
                        let average = productDetail?.average_review;
                        console.log(average);
                        let userRating = [];
                        for (let i = 1; i <= average; i++) {
                          userRating.push(<i className="bi bi-star-fill"></i>);
                        }
                        userRating.push(<i class="bi bi-star-half"></i>);
                        let remaining = 5 - average;
                        console.log(remaining);
                        for (let i = 1; i <= remaining; i++) {
                          userRating.push(
                            <i className="bi bi-star-fill last"></i>
                          );
                        }
                        return userRating;
                      })()}
                    </p> */}
                </div>
              </div>
              <div className="star-progress-container">
                {(() => {
                  let userReviewTag = [];
                  let reviewCouter = [0, 0, 0, 0, 0];
                  reversedReviews?.map(
                    (review) =>
                      (reviewCouter[parseInt(review?.rating) - 1] += 1)
                  );
                  let reviewPercent = 0;
                  for (let i = 0; i < reviewCouter.length; i++) {
                    reviewPercent =
                      (reviewCouter[i] / productDetail?.reviews_count) * 100;
                    userReviewTag.push(
                      <div className="star-progress">
                        <p>{i + 1} Star </p>
                        <div className="progressbar">
                          <div
                            className="progress"
                            style={{ width: `${reviewPercent}%` }}
                          >
                            <span className="value">
                              {reviewPercent.toFixed(1)}%
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return userReviewTag;
                })()}
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div
            style={{
              direction: "ltr",
              fontFamily: "sans-serif",
              touchAction: "none",
              margin: "10px 0px 20px 0px",
            }}
          >
            <Rating onClick={handleRating} allowFraction transition size={24} />
          </div>
          <textarea
            {...register("comment")}
            name="comment"
            placeholder="Enter Your Comment"
            id="textarea"
            cols="30"
            rows="3"
          ></textarea>

          <div>
            <i id="errorMsg" className="text-danger py-2"></i>
          </div>

          <input
            className="commentSubmitBtn"
            type="submit"
            value="Post Comment"
          />
        </form>

        <div className="mb-5 pb-5 reviews_list">
          {reversedReviews &&
            reversedReviews?.map((review) => (
              <div key={review.id} className="review-cart">
                <div className="users-content">
                  <div className="user-img">
                    <img src="/img/userimg (1).webp" alt="" />
                  </div>
                  <div className="user-qa-header">
                    <p>
                      <i className="bi bi-person"></i> {review?.customer?.name}
                    </p>
                    <p className="mx-2">
                      <i className="bi bi-clock"></i>{" "}
                      {review?.created_at.slice(0, 10)}
                    </p>

                    <RatingStar id={review?.id} rating={review?.rating} />
                    {/* <p className="rating-star">
                      {(() => {
                        let average = productDetail?.average_review;
                        console.log(average);
                        let userRating = [];
                        for (let i = 1; i <= average; i++) {
                          userRating.push(<i className="bi bi-star-fill"></i>);
                        }
                        userRating.push(<i class="bi bi-star-half"></i>);
                        let remaining = 5 - average;
                        console.log(remaining);
                        for (let i = 1; i <= remaining; i++) {
                          userRating.push(
                            <i className="bi bi-star-fill last"></i>
                          );
                        }
                        return userRating;
                      })()}
                    </p> */}
                  </div>
                </div>
                <small>{review?.comment}</small>
              </div>
            ))}
        </div>
      </div>
    </>
  );
};

export default Home;
