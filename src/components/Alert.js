import React from "react";
import { Alert as BootstrapAlert } from "react-bootstrap";

const Alert = ({ message, transactionHash, variant, setShowAlert }) => {
  return (
    <BootstrapAlert
      variant={variant}
      onClose={() => setShowAlert(false)}
      dismissible
      className="alert"
    >
      <BootstrapAlert.Heading>{message}</BootstrapAlert.Heading>
      <hr />
      {transactionHash && (
        <div className="transaction-details">
          <strong>Transaction Hash:</strong>
          <span>
            {transactionHash.slice(0, 6) +
              "..." +
              transactionHash.slice(60, 66)}
          </span>
          {/* link to a block explorer */}
          <a href={`https://block-explorer.com/tx/${transactionHash}`} target="_blank" rel="noopener noreferrer">View on Explorer</a>
        </div>
      )}
    </BootstrapAlert>
  );
};


export default Alert;
