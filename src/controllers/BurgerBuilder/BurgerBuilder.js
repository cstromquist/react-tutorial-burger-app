import React, { Component } from 'react';

import Aux from '../../hoc/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/BuildControls/BuildControls';

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
		totalPrice: 4
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
		})
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
				<Burger ingredients={this.state.ingredients} />
				<BuildControls
					ingredientRemoved={this.removeIngredientsHandler}
					disabledInfo={disabledInfo}
					ingredientAdded={this.addIngredientsHandler}
					price={this.state.totalPrice} />
			</Aux>
		);
	}
}

export default BurgerBuilder;