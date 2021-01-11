import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import Aux from "../../hoc/Aux/Aux";
import Burger from "../../components/Burger/Burger";
import BuildControls from "../../components/Burger/BuildControls/BuildControls";
import Modal from "../../components/UI/Modal/Modal";
import OrderSummary from "../../components/Burger/OrderSummary/OrderSummary";
import axios from "../../axios-orders";
import Spinner from "../../components/UI/Spinner/Spinner";
import withErrorHandler from "../../hoc/withErrorHandler/withErrorHandler";
import * as actions from "../../store/actions/index";

const BurgerBuilder = (props) => {
	const [purchasing, setPurchasing] = useState(false);

	const dispatch = useDispatch();
	// ingredients: state.burgerBuilder.ingredients,
	// totalPrice: state.burgerBuilder.totalPrice,
	// error: state.burgerBuilder.error,
	// isAuthenticated: state.auth.token !== null,

	const ingredients = useSelector((state) => state.burgerBuilder.ingredients);
	const totalPrice = useSelector((state) => state.burgerBuilder.totalPrice);
	const error = useSelector((state) => state.burgerBuilder.error);
	const isAuthenticated = useSelector((state) => state.auth.token !== null);

	const onIngredientAdded = (ingName) =>
		dispatch(actions.addIngredient(ingName));
	const onIngredientRemoved = (ingName) =>
		dispatch(actions.removeIngredient(ingName));
	const onInitIngredients = useCallback(
		() => dispatch(actions.initIngredient()),
		[dispatch]
	);
	const onInitPurchased = () => dispatch(actions.purchaseInit());
	const onSetAuthRedirectPath = (path) =>
		dispatch(actions.setAuthRediectPath(path));

	useEffect(() => onInitIngredients(), [onInitIngredients]);

	const updatePurchaseState = (ingredients) => {
		const sum = Object.keys(ingredients)
			.map((igKey) => {
				return ingredients[igKey];
			})
			.reduce((sum, el) => {
				return sum + el;
			}, 0);
		return sum > 0;
	};

	const purchaseHandler = () => {
		if (isAuthenticated) {
			setPurchasing(true);
		} else {
			onSetAuthRedirectPath("/checkout");
			props.history.push("/auth");
		}
	};

	const purchaseCancelHandler = () => {
		setPurchasing(false);
	};

	const purchaseContinueHandler = () => {
		onInitPurchased();
		props.history.push("/checkout");
	};

	const disabledInfo = {
		...ingredients,
	};
	for (let key in disabledInfo) {
		disabledInfo[key] = disabledInfo[key] <= 0;
	}
	// {salad: true, meat: false, ...}
	let orderSummary = null;
	let burger = error ? <p>Ingredients can't be loaded</p> : <Spinner />;
	if (ingredients) {
		burger = (
			<Aux>
				<Burger ingredients={ingredients} />
				<BuildControls
					ingredientAdded={onIngredientAdded}
					ingredientRemoved={onIngredientRemoved}
					disabled={disabledInfo}
					purchasable={updatePurchaseState(ingredients)}
					ordered={purchaseHandler}
					isAuthenticated={isAuthenticated}
					price={totalPrice}
				/>
			</Aux>
		);
		orderSummary = (
			<OrderSummary
				ingredients={ingredients}
				price={totalPrice}
				purchaseCancelled={purchaseCancelHandler}
				purchaseContinued={purchaseContinueHandler}
			/>
		);
	}

	return (
		<Aux>
			<Modal show={purchasing} modalClosed={purchaseCancelHandler}>
				{orderSummary}
			</Modal>
			{burger}
		</Aux>
	);
};

export default withErrorHandler(BurgerBuilder, axios);
