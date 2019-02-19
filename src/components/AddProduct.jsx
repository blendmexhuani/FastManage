import React, { Component } from 'react';
import { Form, Input, Button, Modal } from 'antd';
import { withRouter } from "react-router-dom";
import { graphql } from 'react-apollo';
import { gql } from 'apollo-boost';
import * as moment from 'moment';


function success() {
  Modal.success({
    title: 'The product has been added successfully',
    content: 'Press OK to continue...',
  });
}


class AddProduct extends Component {
    state = {
        name: "",
        description: "",
        imageUrl: "",
        quantity: '',
        basePrice: '',
        taxRate: '',
        salePrice: '',
        specialDiscount: '',
        addError: false
      }
    
    handleSubmit = (data, sPrice) => {
        const {name, description, quantity, imageUrl, basePrice, taxRate, specialDiscount} = data;

        if(name == "" || description == "" || quantity == "" || imageUrl == "" || 
          basePrice == ""){
            this.setState({addError: true});
        }

        else{
          this.props.addProductMutation({
            variables: {
                name, 
                description, 
                imageUrl: imageUrl.replace(/^.*[\\\/]/, ''),
                quantity: parseInt(quantity, 10), 
                basePrice: parseInt(basePrice,10), 
                taxRate: isNaN(parseInt(taxRate,10)) ? 0 : parseInt(taxRate,10),
                specialDiscount: isNaN(parseInt(specialDiscount,10)) ? 0 : parseInt(specialDiscount,10), 
                salePrice: sPrice,
                timestamps: moment().format(),
                id: this.props.userID
            },
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
            }).then(result => {
              this.setState({ 
                name: "",
                description: "",
                imageUrl: "",
                quantity: '',
                basePrice: '',
                taxRate: '',
                salePrice: '',
                specialDiscount: '',
                id: '',
                addError: false });
                success();
            })
            .catch(err => {
              this.setState({addError: true});
              console.log("Error while adding the product: ", err);
            })
          }
        }
    
    handleClear = () => {
        this.setState({ 
            name: "",
            description: "",
            imageUrl: "",
            quantity: '',
            basePrice: '',
            taxRate: '',
            salePrice: '',
            specialDiscount: '',
            addError: false });
      }

    render() {

        var discount = (this.state.basePrice * (this.state.specialDiscount/100)) > 0 ? 
            (this.state.basePrice * (this.state.specialDiscount/100)) : 0;
        var tax = discount == 0 ? (this.state.taxRate/100) : (discount * (this.state.taxRate/100));
        var sPrice=this.state.basePrice-discount-tax;
        
        return (
            <Form className="login-form addProduct">
                    <Form.Item>Name: <span style={{color: "#ff0000"}}>*</span>
                        <Input value={this.state.name} onChange={(event)=>{
                          this.setState({name: event.target.value}); }}/>
                    </Form.Item>
                    <Form.Item>Description: <span style={{color: "#ff0000"}}>*</span>
                        <Input value={this.state.description} onChange={(event)=>{
                          this.setState({description: event.target.value}); }} />
                    </Form.Item>
                    <Form.Item>Image Url: <span style={{color: "#ff0000"}}>*</span>
                        <input type="file" value={this.state.imageUrl} onChange={(event)=>{
                            this.setState({imageUrl: event.target.value}); }} />
                    </Form.Item>
                    <Form.Item>Quantity: <span style={{color: "#ff0000"}}>*</span>
                        <Input value={this.state.quantity} onChange={(event)=>{
                          this.setState({quantity: event.target.value}); }}/>
                    </Form.Item>
                    <Form.Item>Base Price: <span style={{color: "#ff0000"}}>*</span>
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
                    {this.state.addError && 
                      <div>
                          <br />
                          <label style={{color: "#ff0000"}}>
                            Please fill out the form!
                          </label>
                      </div>
                    }
                    <div style={{marginTop: "25px"}}>
                      <Button type="default" onClick={this.handleClear}>Clear</Button>
                      <Button type="primary" style={{marginLeft: "5px"}} onClick={() => this.handleSubmit(this.state, sPrice)}>Add</Button>
                    </div>
                    <br />
                    <span style={{color: "#ff0000"}}>*</span> Required field
            </Form>
      );
    }
  }

const addProduct = gql`
  mutation AddProductMutation(
      $name: String!, 
      $description: String!
      $imageUrl: String!
      $quantity: Int!
      $basePrice: Float!
      $taxRate: Float!
      $salePrice: Float!
      $specialDiscount: Float
      $timestamps: DateTime!
      $id: ID!){
    createProduct(data: {
      name: $name,
      description: $description,
      imageUrl: $imageUrl,
      quantity: $quantity,
      basePrice: $basePrice,
      taxRate: $taxRate,
      salePrice: $salePrice,
      specialDiscount: $specialDiscount,
      timestamps: $timestamps,
      isDeleted: false,
      creator: {
          connect: {
              id: $id
          }
      }
    }){
      id,
      basePrice,
      imageUrl,
      name, 
      quantity,
      description,
      salePrice, 
      specialDiscount,
      taxRate
    }
}
`

export default graphql(addProduct, { name: 'addProductMutation'})(
    withRouter(AddProduct),
)