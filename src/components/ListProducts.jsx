import React, { Component } from 'react';
import { List, Row, Col, Spin } from 'antd';
import Product from './Product';
import { withRouter } from "react-router-dom";
import { graphql } from 'react-apollo';
import { gql } from 'apollo-boost';

class ListProducts extends Component {
    render() {
      if(!this.props.data){
        return <div style={{ width: 0, margin: "0 auto", verticalAlign: "middle" }}><Spin size="large" /></div>
      }
      if(this.props.data.loading){
        return <div style={{ width: 0, margin: "0 auto", verticalAlign: "middle" }}><Spin size="large" /></div>
      }
      return (
        <List>
            <Row>
                {this.props.data.products.filter((item) => item.isDeleted == false).map(item =>
                    <Col span={12} key={item.id}>
                        <List.Item>
                            <Product product={item} userID={this.props.userID}/>      
                        </List.Item>
                    </Col>
                )}
            </Row>
        </List>
      );
    }
  }

  const productList = gql`
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

export default graphql(productList)(
    withRouter(ListProducts),
  )
