import React, { Component } from 'react';

import Aux from '../../hoc/Aux/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import axios from '../../axios-orders';

const INGREDIENT_PRICES = {
	salad: 0.5,
	cheese: 0.4,
	meat: 1.3,
	bacon: 0.7
}

class BurgerBuilder extends Component {
	state = {
		ingredients: null,
		totalPrice: 4,
		purchasable: false,
		purchasing: false,
		loading: false,
		error: false
	}

	componentDidMount () {
		axios.get('https://react-my-burger-2f9cc.firebaseio.com/ingredients.json')
			.then(response => {
				this.setState({ingredients: response.data})
			})
			.catch(error => {
				this.setState({error: true});
			});
	}

	purchaseHandler = () => {
		this.setState({ purchasing: true });
	}

	purchaseCancelHandler = () => {
		this.setState({ purchasing: false });
	}

	purchaseContinueHandler = () => {
		const queryParams = [];
		for (let i in this.state.ingredients) {
			queryParams.push(encodeURIComponent(i) + '=' + encodeURIComponent(this.state.ingredients[i]));
		}
		queryParams.push('price=' + this.state.totalPrice);
		this.props.history.push({
			pathname: '/checkout',
			search: queryParams.join('&')
		});
	}

	updatePurchaseState(ingredients) {
		const sum = Object.keys(ingredients)
			.map(igKey => {
				return ingredients[igKey];
			})
			.reduce((sum, el) => {
				return sum + el
			}, 0);
		this.setState({ purchasable: sum > 0 });
	}

	addIngredientsHandler = (type) => {
		const updatedIngredients = {
			...this.state.ingredients
		}
		updatedIngredients[type] = this.state.ingredients[type] + 1;
		this.setState({
			totalPrice: this.state.totalPrice + INGREDIENT_PRICES[type],
			ingredients: updatedIngredients
		});
		this.updatePurchaseState(updatedIngredients);
	}

	removeIngredientsHandler = (type) => {
		if (this.state.ingredients[type] <= 0) {
			return;
		}
		const updatedIngredients = {
			...this.state.ingredients
		}
		updatedIngredients[type] = this.state.ingredients[type] - 1;
		this.setState({
			totalPrice: this.state.totalPrice - INGREDIENT_PRICES[type],
			ingredients: updatedIngredients
		});
		this.updatePurchaseState(updatedIngredients);
	}

	render() {
		const disabledInfo = {
			...this.state.ingredients
		}
		for (let key in disabledInfo) {
			disabledInfo[key] = this.state.ingredients[key] <= 0 ? true : false;
		}
		let orderSummary = null;

		if (this.state.loading) {
			orderSummary = <Spinner />;
		}
		let burger = this.state.error ? <p>Ingredients can't be loaded!</p> : <Spinner />;
		
		if (this.state.ingredients) {
			burger = (
				<Aux>
					<Burger ingredients={this.state.ingredients} />
					<BuildControls
						ingredientRemoved={this.removeIngredientsHandler}
						ingredientAdded={this.addIngredientsHandler}
						disabledInfo={disabledInfo}
						purchasable={this.state.purchasable}
						ordered={this.purchaseHandler}
						price={this.state.totalPrice} />
				</Aux>
			);
			orderSummary = <OrderSummary
				ingredients={this.state.ingredients}
				cancel={this.purchaseCancelHandler}
				continue={this.purchaseContinueHandler}
				price={this.state.totalPrice}
			/>;
		}
		return (
			<Aux>
				<Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
					{orderSummary}
				</Modal>
				{burger}
			</Aux>
		);
	}
}

export default withErrorHandler(BurgerBuilder, axios);