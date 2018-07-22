import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Image, StyleSheet, View } from 'react-native';
import Modal from 'react-native-modal';
import {
  Button,
  Text,
  Icon,
  Card,
  CardItem,
  Container,
  Header,
  Left,
  Right,
  Body,
  Title,
  Content,
  Tab,
  Tabs
} from 'native-base';

import { loadAccount } from '../actions/account';
import BarCodeScanner from '../components/BarCodeScanner';
import TransactionSender from '../components/TransactionSender';
import { decodePublicKey } from '../lib/keypairHelpers';
import { parseTransactionAmount } from '../lib/formatter';
import modalStyle from '../styles/modal';
import image from '../../assets/img/qr-code.png';

export class SendScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isModalVisible: false,
      showScanner: false,
      showTransactionSender: false,
      receiver: null,
      amount: null
    };

    this.openSenderModal = this.openSenderModal.bind(this);
    this.handleTransactionSuccess = this.handleTransactionSuccess.bind(this);
    this.handleTransactionFailure = this.handleTransactionFailure.bind(this);
    this.openScannerModal = this.openScannerModal.bind(this);
    this.handleScannedCode = this.handleScannedCode.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  openSenderModal() {
    this.setState({ isModalVisible: true, showTransactionSender: true });
  }

  closeModal() {
    this.setState({
      isModalVisible: false,
      showTransactionSender: false,
      showScanner: false,
      receiver: null,
      amount: null
    });
  }

  handleTransactionSuccess() {
    this.props.loadAccount(this.props.keypair.publicKey());
    this.closeModal();
  }

  handleTransactionFailure() {
    this.props.loadAccount(this.props.keypair.publicKey());
    this.closeModal();
  }

  openScannerModal() {
    this.setState({ isModalVisible: true, showScanner: true });
  }

  handleScannedCode({ publicKey, options }) {
    const newState = {
      receiver: publicKey,
      isModalVisible: true,
      showScanner: false,
      showTransactionSender: true
    };

    if (options.amount) {
      const amount = parseTransactionAmount(options.amount.toString());

      if (amount) {
        newState.amount = amount;
      }
    }

    this.setState(newState);
  }

  renderScanner() {
    if (!this.state.showScanner) return null;

    return (
      <BarCodeScanner
        onCancel={this.closeModal}
        onCodeScan={this.handleScannedCode}
        decoder={decodePublicKey}
      />
    );
  }

  renderTransactionSender() {
    if (!this.state.showTransactionSender) return null;

    return (
      <TransactionSender
        amount={this.state.amount}
        receiver={this.state.receiver}
        onCancel={this.closeModal}
        onSuccess={this.handleTransactionSuccess}
        onFailure={this.handleTransactionFailure}
      />
    );
  }

  render() {
    const scanCodeButtonCaption = this.state.isModalVisible
      ? 'Opening Camera...'
      : 'Scan QR Code';

    return (
      <Content padder>
        <Card>
          <CardItem header>
            <Text>Scan Receiver QR Code</Text>
          </CardItem>
          <CardItem cardBody>
            <Image
              style={{ flex: 1, width: null, height: 250 }}
              resizeMode="contain"
              source={image}
            />
          </CardItem>
          <CardItem>
            <Body>
              <Button
                block
                disabled={this.isModalVisible}
                onPress={this.openScannerModal}
              >
                <Text>{scanCodeButtonCaption}</Text>
              </Button>
            </Body>
          </CardItem>
        </Card>
        <Button block transparent onPress={this.openSenderModal}>
          <Text>Manually Enter Receiver</Text>
        </Button>

        <Modal
          isVisible={this.state.isModalVisible}
          onBackButtonPress={this.closeModal}
          style={modalStyle.modal}
        >
          {this.renderScanner()}
          {this.renderTransactionSender()}
        </Modal>
      </Content>
    );
  }
}

SendScreen.propTypes = {
  keypair: PropTypes.object.isRequired,
  loadAccount: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  keypair: state.keypair.keypair
});

const mapDispatchToProps = dispatch => ({
  loadAccount: publicKey => dispatch(loadAccount(publicKey))
});

export default connect(mapStateToProps, mapDispatchToProps)(SendScreen);
