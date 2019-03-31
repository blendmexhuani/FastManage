import React, { Component } from 'react';
import { Avatar, Row, Col, Button, Modal, Form, Input } from 'antd';
import { withRouter } from "react-router-dom";
import { graphql, compose } from 'react-apollo';
import  { gql } from 'apollo-boost';
import * as moment from 'moment';
import axios from 'axios';

const confirm = Modal.confirm;

function showDeleteConfirm(props) {
    confirm({
      title: 'Are you sure you want to delete this product ?',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        props.DeleteProductMutation({
          variables: {id: props.product.id},
          refetchQueries: [
            {
              query: gql`
              query products{
                products{
                    id
                    name
                    description
                    imageUrl
                    quantity
                    basePrice
                    taxRate
                    salePrice
                    specialDiscount
                    creator {
                        id
                        username
                    }
                    isDeleted
                }
              }
            `
            }
          ]
        })
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }

function importAll(r) { return r.keys().map(r); }
const images = importAll(require.context('../images', false, /\.(png|jpe?g|svg)$/));

class Product extends Component {
      state = {
        loading: false,
        visible: false,
        name: "",
        description: "",
        quantity: 0,
        basePrice: 0,
        taxRate: 0,
        salePrice: 0,
        specialDiscount: 0,
        imageUrl: '',
        selectedFile: ''
      }

      showModal = () => {
        const { name, 
                description, 
                quantity,
                basePrice,
                taxRate,
                specialDiscount } = this.props.product;
        this.setState({
          visible: true,
          name,
          description,
          quantity,
          basePrice,
          taxRate,
          specialDiscount
        });
      }
    
      handleOk = (data, id, sPrice) => {
        console.log("sPrice", sPrice);
        const {name, description, quantity, basePrice, taxRate, specialDiscount, selectedFile, imageUrl}= data;

        if(imageUrl){
          let formData = new FormData();
          formData.append('myImage', selectedFile);
          axios.post('http://localhost:5000/upload', formData)
            .then(res => {
              return res.data.split("/")[1];
            })
            .then(res => {
              this.props.editProductMutation({
                variables: {
                    name, 
                    description, 
                    imageUrl: res,
                    quantity: parseInt(quantity, 10), 
                    basePrice: parseInt(basePrice,10), 
                    taxRate: parseInt(taxRate,10),
                    specialDiscount: parseInt(specialDiscount,10), 
                    salePrice: sPrice,
                    timestamps: moment().format(),
                    id
                }
              })
              this.setState({ loading: true });
              setTimeout(() => {
                this.setState({ loading: false, visible: false });
              }, 1000);
            })
            .catch((err) => {
              console.log(err);
            });
        }else{
          this.props.editProductMutation({
            variables: {
                name, 
                description, 
                quantity: parseInt(quantity, 10), 
                basePrice: parseInt(basePrice,10), 
                taxRate: parseInt(taxRate,10),
                specialDiscount: parseInt(specialDiscount,10), 
                salePrice: sPrice,
                timestamps: moment().format(),
                id
            }
          })
          this.setState({ loading: true });
          setTimeout(() => {
            this.setState({ loading: false, visible: false });
          }, 1000);
        }
      }

      handleCancel = () => {
        this.setState({ visible: false });
      }

      imageChange = (event) => {
        this.setState({ 
            imageUrl: event.target.value,
            selectedFile: event.target.files[0]
        });
    }  

    render() {

        const { visible, loading } = this.state;
        var tax = (this.state.basePrice * (this.state.taxRate/100)) > 0 ? 
            (this.state.basePrice * (this.state.taxRate/100)) : 0;
        var sPrice = (this.state.basePrice + tax) - ((this.state.basePrice + tax) * (this.state.specialDiscount/100));

        const { id,
                basePrice, 
                creator, 
                imageUrl, 
                name, 
                quantity,
                description,
                salePrice, 
                specialDiscount,
                taxRate } = this.props.product;

        let renderHtml = <p>Price: {salePrice.toFixed(2)}€</p>
        
        if(specialDiscount > 0){
            renderHtml = <p>Price: <span className="basePrice">{basePrice}€</span> <span className="salePrice">{salePrice.toFixed(2)}€</span></p>
        }

        var imageSrc = "";

        return (
            <div style={{width: "100%"}}>
                <Row>
                    <Col span={12}>
                    {images.filter(item => 
                      item.indexOf(
                        imageUrl.substring(0, imageUrl.lastIndexOf('.'))
                      ) !== -1).map((item, index) => {
                        imageSrc = item;
                    })}
                    {specialDiscount > 0 &&
                      <Avatar style={{backgroundColor: "#ff0000", verticalAlign: "top", zIndex: "1", position: "absolute"}} size="large">
                        -{specialDiscount}%
                      </Avatar>
                    }
                      <img src={imageSrc} height="230px" width="230px"/>
                      <h3 style={{marginLeft: "20px"}}><p>Name: {name}</p></h3>
                    </Col>
                    <Col span={11} style={{position: "relative"}}>
                        <p>Description: {description}</p>
                        {renderHtml}
                        <p><b>{quantity} items</b> are in stock.</p>
                        <p>Tax Rate: {taxRate}%</p>
                        <p>Creator: {creator.username}</p>
                    </Col>
                    { creator.id == this.props.userID && 
                      <div>
                        <Button type="primary" onClick={this.showModal} style={{marginRight: "5px"}}>Edit</Button>
                        <Button type="danger" onClick={()=>showDeleteConfirm(this.props)}>Delete</Button>
                      </div>
                    }
                </Row>

                <Modal
                    visible={visible}
                    style={{ top: 20 }}
                    width={700}
                    centered
                    title="Edit Product"
                    onCancel={this.handleCancel}
                    footer={[
                        <Button key="back" onClick={this.handleCancel}>Return</Button>,
                        <Button key="submit" type="primary" loading={loading} 
                        onClick={()=>this.handleOk(this.state, id, sPrice )}>
                        Submit
                        </Button>,
                    ]}
                    >
                    <Form enctype="multipart/form-data">
                      <Form.Item label="Name">
                          <Input value={this.state.name}  onChange={(event)=>{
                            this.setState({name: event.target.value}); }}/>
                      </Form.Item>
                      <Form.Item label="Description">
                          <Input value={this.state.description} onChange={(event)=>{
                            this.setState({description: event.target.value}); }} />
                      </Form.Item>
                      <Form.Item label="Image Url">
                        <input type="file" name="myImage" value={this.state.imageUrl} 
                          onChange={(e) => this.imageChange(e)} />
                      </Form.Item>
                      <Form.Item label="Quantity">
                          <Input value={this.state.quantity} onChange={(event)=>{
                            this.setState({quantity: event.target.value}); }}/>
                      </Form.Item>
                      <Form.Item label="Base Price">
                          <Input value={this.state.basePrice} onChange={(event)=>{
                            this.setState({basePrice: event.target.value}); }} />
                      </Form.Item>
                      <Form.Item label="Special Discount">
                          <Input value={this.state.specialDiscount} onChange={(event)=>{
                            this.setState({specialDiscount: event.target.value}); }} />
                      </Form.Item>
                      <Form.Item label="Tax Rate">
                          <Input value={this.state.taxRate} onChange={(event)=>{
                            this.setState({taxRate: event.target.value}); }} />
                      </Form.Item>
                      <Form.Item label="Sale Price">
                          <Input value={sPrice} />
                      </Form.Item>
                    </Form>
                </Modal>
            </div>
      );
    }
  }

  const editProduct = gql`
  mutation EditProductMutation(
      $id: ID!
      $name: String!
      $description: String!
      $imageUrl: String
      $quantity: Int!
      $basePrice: Float!
      $taxRate: Float!
      $salePrice: Float!
      $specialDiscount: Float
      $timestamps: DateTime!){
    updateProduct(data: {
      name: $name,
      description: $description,
      imageUrl: $imageUrl,
      quantity: $quantity,
      basePrice: $basePrice,
      taxRate: $taxRate,
      salePrice: $salePrice,
      specialDiscount: $specialDiscount,
      timestamps: $timestamps
    } where: {id: $id}){
      id,
      basePrice,  
      name, 
      imageUrl,
      quantity,
      description,
      salePrice, 
      specialDiscount,
      taxRate
    }
}
`
const deleteProduct = gql`
mutation DeleteProductMutation( $id: ID!){
  updateProduct(data: {
      isDeleted: true,
  } where: {id: $id}){
    isDeleted
  }
}
`
const updateProduct=graphql(editProduct, { name: 'editProductMutation' });
const delProduct=graphql(deleteProduct, { name: 'DeleteProductMutation' });

export default compose(delProduct,updateProduct)(
    withRouter(Product),
)
