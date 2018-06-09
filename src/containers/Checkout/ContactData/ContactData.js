import React, { Component } from 'react';

import Button from '../../../components/UI/Button/Button';
import Spinner from '../../../components/UI/Spinner/Spinner';
import axios from '../../../axios-orders';
import classes from './ContactData.css';

class ContactData extends Component {
	state = {
		name: '',
		email: '',
		address: {
			street: '',
			postalCode: ''
		},
		totalPrice: 0,
		loading: false
	}

	orderHandler = (event) => {
		event.preventDefault();
		this.setState({ loading: true });
		const order = {
			ingredients: this.props.ingredients,
			price: this.props.totalPrice,
			customer: {
				name: 'Jack Johnson',
				address: {
					street: '123 Test Ave',
					zipCode: '12345',
					country: 'US'
				},
				email: 'test@test.com'
			},
			deliveryMethod: 'fastest'
		}
		axios.post('/orders.json', order)
			.then(response => {
				this.setState({ loading: false, });
				this.props.history.push('/');
			})
			.catch(error => {
				this.setState({ loading: false });
			});
		console.log(this.props.ingredients);
	}

	render() {
		let form = (
			<div className={classes.ContactData}>
				<h4>Enter your Contact Data</h4>
				<form>
					<input className={classes.Input} type="text" name="name" placeholder="Your Name" />
					<input className={classes.Input} type="email" name="email" placeholder="Your Email" />
					<input className={classes.Input} type="text" name="address" placeholder="Your Address" />
					<input className={classes.Input} type="text" name="postalCode" placeholder="Your Postal Code" />
					<Button btnType="Success" clicked={this.orderHandler}>ORDER</Button>
				</form>
			</div>
		);
		if(this.state.loading) {
			form = <Spinner />;
		}
		return (
			form
		);
	}
}

export default ContactData;