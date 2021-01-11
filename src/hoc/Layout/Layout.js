import React, { useState } from "react";
import { connect } from "react-redux";

import Aux from "../Aux/Aux";
import classes from "./Layout.module.css";
import Toolbar from "../../components/Navigation/Toolbar/Toolbar";
import SideDrawer from "../../components/Navigation/SideDrawer/SideDrawer";

const Layout = (props) => {
	const [sideDrawerIsVisible, setSideDrawerIsVisible] = useState(false);

	const sideDrawerClosedHandler = () => {
		setSideDrawerIsVisible(false);
	};

	const sideDrawerToggleHandler = () => {
		setSideDrawerIsVisible(!sideDrawerIsVisible);
	};

	return (
		<Aux>
			<Toolbar
				isAuthenticated={props.isAuthenticated}
				drawerToggleClicked={sideDrawerToggleHandler}
			/>
			<SideDrawer
				open={sideDrawerIsVisible}
				closed={sideDrawerClosedHandler}
				isAuthenticated={props.isAuthenticated}
			/>
			<main className={classes.Content}>{props.children}</main>
		</Aux>
	);
};

const mapStateToProps = (state) => {
	return {
		isAuthenticated: state.auth.token !== null,
	};
};

export default connect(mapStateToProps)(Layout);
