import React, { useState, useEffect } from "react";
// import Card from '../../Components/Cardfirst/Card'
import Navbar from "../../Components/Navbar1/Navbar";
import { db } from "../../fbconfig";
import GridContainer from "../../Components/Grid/GridContainer.js";
import GridItem from "../../Components/Grid/GridItem.js";
import { Col, Row } from "react-bootstrap";
import { Card, CardMedia, makeStyles } from "@material-ui/core";
import {
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  increment,
  query,
  updateDoc,
  where,
} from "@firebase/firestore";
import { useAuth } from "../../auth/useAuth";
import "./items.css";
import { NavLink, useParams } from "react-router-dom";
const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(0),
    minWidth: 120,
  },
  media: {
    // height: 240,
    minHeight: 200,
  },
}));

export const Items = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const classes = useStyles();
  const [items, setItems] = useState([]);
  const addItemToCart = async (mSubType) => {
    // create clicked cart item
    const cartItem = {
      img: mSubType.image,
      name: mSubType.name,
      price: mSubType.price,
      vat: mSubType.price * 0.05,
      quantity:1
    };

    const userCartRef = doc(db, "users", user.uid);

    // push updated cart items to db
    await updateDoc(userCartRef, { carts: arrayUnion(cartItem) });
  };

  const getItems = async () => {
    const vend = query(collection(db, "items"), where("vendorId", "==", id));
    //console.log(data);
    const querySnapshot = await getDocs(vend);
    setItems(querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };
  const [isSubscribed, setSubscribed] = useState(true);
  useEffect(() => {
    getItems();
    return () => {
      setSubscribed(false);
    };
  }, []);
  console.log(items);
  return (
    <div>
      <Navbar />
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <Row>
        <Col className="m-4">
          <GridContainer>
            {items.map((item) => {
              return (
                <GridItem xs={12} sm={12} md={4} lg={4}>
                  <Card>
                    <CardMedia
                      className={classes.media}
                      image={item.image}
                      title={"Image"}
                    />
                    <br></br>
                    <div className="itemBody">
                      <div className="itemTitle">
                        <div className="titCon">
                          <h4>
                            <b>
                              {item.name} &nbsp; ({item.type})
                            </b>
                          </h4>
                        </div>
                        <div className="titCon">
                          <h6>
                            <b>${item.price}</b>
                          </h6>
                        </div>
                        <div className="titCon">
                          <p>
                            <b>{item.washIron && "wash & Iron"}</b>
                          </p>
                          <p>
                            <b>{item.washOnly && "wash Only"}</b>
                          </p>
                          <p>
                            <b>{item.ironOnly && "iron Only"}</b>
                          </p>
                          <p>
                            <b>{item.dryClean && "dry Clean"}</b>
                          </p>
                        </div>
                      </div>

                      <div className="itemTitle">
                        <button
                          onClick={async () => {
                            await addItemToCart(item);
                          }}
                          type="button"
                          className="btn btn-danger  m-4 "
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </Card>
                </GridItem>
              );
            })}
          </GridContainer>
        </Col>
      </Row>
    </div>
  );
};
