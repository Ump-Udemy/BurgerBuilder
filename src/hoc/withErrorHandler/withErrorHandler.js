import React from "react";

import Modal from "../../components/UI/Modal/Modal";
import Aux from "../Aux/Aux";
import useHttpErrorHandler from "../../hooks/http-error-handler";

const WithErrorHandler = (WrappedComponet, axios) => {
	const ErrorModal = (props) => {
		const [error, clearError] = useHttpErrorHandler(axios);
		return (
			<Aux>
				<Modal show={error} modalClosed={clearError}>
					{error ? error.message : null}
				</Modal>
				<WrappedComponet {...props} />
			</Aux>
		);
	};
	return ErrorModal;
};
export default WithErrorHandler;
