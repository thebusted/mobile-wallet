import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { StatusBar, StyleSheet, View, TextInput } from 'react-native';
import { get } from 'lodash';
import {
  Icon,
  Body,
  Card,
  CardItem,
  Container,
  Form,
  Input,
  Label,
  Header,
  Item,
  Left,
  Right,
  Content,
  Button,
  Text,
  Title
} from 'native-base';
import Dimensions from 'Dimensions';
import HeaderCancelButton from '../../components/HeaderCancelButton';
import ShortenedPublicKey from '../../components/ShortenedPublicKey';
import EnterTransactionReceiver from './EnterTransactionReceiver';
import EnterTransactionDetails from './EnterTransactionDetails';
import ConfirmTransactionDetails from './ConfirmTransactionDetails';
import TransactionInProgress from './TransactionInProgress';
import TransactionSuccess from './TransactionSuccess';
import TransactionFailure from './TransactionFailure';
import { sendPayment } from '../../lib/stellarAPI';
import { parseTransactionAmount } from '../../lib/formatter';
import { isValidPublicKey } from '../../lib/keypairHelpers';
import modalStyle from '../../styles/modal';

const wrapTransactionError = error => {
  const operations = get(error, 'response.data.extras.result_codes.operations');

  if (operations) {
    return operations.join(', ');
  }
  return error.message;
};

export class TransactionSender extends Component {
  constructor(props) {
    super(props);

    this.state = {
      amount: props.amount,
      amountError: null,
      receiver: props.receiver,
      receiverError: null,
      inProgress: false,
      error: false,
      response: null
    };

    this.handleReceiverUpdate = this.handleReceiverUpdate.bind(this);
    this.handleAmountUpdate = this.handleAmountUpdate.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleConfirmation = this.handleConfirmation.bind(this);
    this.handleRejection = this.handleRejection.bind(this);
    this.handleSuccess = this.handleSuccess.bind(this);
    this.handleFailure = this.handleFailure.bind(this);
    this.handlePaymentSuccess = this.handlePaymentSuccess.bind(this);
    this.handlePaymentError = this.handlePaymentError.bind(this);
  }

  handleCancel() {
    this.props.onCancel();
  }

  handleReceiverUpdate({ receiverInput }) {
    if (isValidPublicKey(receiverInput)) {
      this.setState({ receiver: receiverInput, receiverError: null });
    } else {
      this.setState({ receiverError: 'Invalid public key' });
    }
  }

  handleAmountUpdate({ amountInput }) {
    const amount = parseTransactionAmount(amountInput);

    if (amount) {
      this.setState({ amount, amountError: null });
    } else {
      this.setState({ amountError: 'Invalid amount' });
    }
  }

  handleConfirmation() {
    const { amount, receiver } = this.state;
    this.setState({ inProgress: true });

    sendPayment({ amount, receiver, keypair: this.props.keypair })
      .then(this.handlePaymentSuccess)
      .catch(this.handlePaymentError);
  }

  handlePaymentSuccess(result) {
    this.setState({
      response: result,
      inProgress: false
    });
  }

  handlePaymentError(error) {
    this.setState({
      error: wrapTransactionError(error),
      inProgress: false
    });
  }

  handleRejection() {
    this.setState({
      amount: null,
      amountError: 'Please enter a new amount'
    });
  }

  handleSuccess() {
    this.props.onSuccess();
  }

  handleFailure() {
    this.props.onFailure();
  }

  renderCloseButton() {
    if (this.state.inProgress || this.state.response || this.state.error) {
      return null;
    }

    return <HeaderCancelButton onCancel={this.handleCancel} />;
  }

  renderSubview() {
    if (this.state.inProgress) {
      return <TransactionInProgress />;
    } else if (this.state.response) {
      return (
        <TransactionSuccess
          receiver={this.state.receiver}
          amount={this.state.amount}
          onAcknowledge={this.handleSuccess}
        />
      );
    } else if (this.state.error) {
      return (
        <TransactionFailure
          receiver={this.state.receiver}
          amount={this.state.amount}
          error={this.state.error}
          onAcknowledge={this.handleFailure}
        />
      );
    } else if (!this.state.receiver) {
      return (
        <EnterTransactionReceiver
          error={this.state.receiverError}
          onSubmit={this.handleReceiverUpdate}
        />
      );
    } else if (!this.state.amount) {
      return (
        <EnterTransactionDetails
          receiver={this.state.receiver}
          error={this.state.amountError}
          onSubmit={this.handleAmountUpdate}
        />
      );
    } else if (this.state.amount && this.state.receiver) {
      return (
        <ConfirmTransactionDetails
          receiver={this.state.receiver}
          amount={this.state.amount}
          onConfirm={this.handleConfirmation}
          onReject={this.handleRejection}
        />
      );
    }
    throw 'Invalid configuration of TransactionSender';
  }

  render() {
    return (
      <Container style={modalStyle.container}>
        <Header>
          <Left>{this.renderCloseButton()}</Left>
          <Body>
            <Title>Send CNDY</Title>
          </Body>
          <Right />
        </Header>
        <Content padder>{this.renderSubview()}</Content>
      </Container>
    );
  }
}

TransactionSender.defaultProps = {
  amount: null,
  receiver: null
};

TransactionSender.propTypes = {
  onCancel: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
  onFailure: PropTypes.func.isRequired,
  amount: PropTypes.string,
  receiver: PropTypes.string
};

const mapStateToProps = state => ({
  keypair: state.keypair.keypair
});

const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(TransactionSender);
