import React, { Component } from 'react';

import Aux from '../../hoc/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';

const INGREDIENT_PRICES = {
	salad: 0.5,
	cheese: 0.4,
	meat: 1.3,
	bacon: 0.7
}

class BurgerBuilder extends Component {
	state = {
		ingredients: {
			salad: 0,
			bacon: 0,
			cheese: 0,
			meat: 0
		},
		totalPrice: 4,
		purchasable: false,
		purchasing: false
	}

	purchaseHandler = () => {
		this.setState({purchasing: true});
	}

	updatePurchaseState (ingredients) {
		const sum = Object.keys(ingredients)
			.map(igKey => {
				return ingredients[igKey];
			})
			.reduce((sum, el) => {
				return sum + el
			}, 0);
		this.setState({purchasable: sum > 0});
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

	render () {
		const disabledInfo = {
			...this.state.ingredients
		}
		for (let key in disabledInfo) {
			disabledInfo[key] = this.state.ingredients[key] <= 0 ? true : false;
		}
		
		return (
			<Aux>
				<Modal show={this.state.purchasing}>
					<OrderSummary ingredients={this.state.ingredients} />
				</Modal>
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
	}
}

export default BurgerBuilder;