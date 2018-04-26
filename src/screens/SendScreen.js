import React, { Component, PropTypes } from 'react';
import { Button, StyleSheet, View, Text } from 'react-native';
import Modal from 'react-native-modal';

import modalStyle from '../styles/modal';
import HeaderWithBalance from '../components/HeaderWithBalance';
import BarCodeScanner from '../components/BarCodeScanner';
import TransactionSender from '../components/TransactionSender';
import { decodePublicKey } from '../lib/keypairHelpers';

export class SendScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state;

    return {
      headerTitle: <HeaderWithBalance />,
      headerLeft: (
        <Button onPress={() => navigation.navigate('Settings')} title="|||" />
      ),
      title: 'Send'
    };
  };

  constructor(props) {
    super(props);

    this.state = {
      isScannerModalVisible: false,
      isSenderModalVisible: false
    };

    this.openSenderModal = this.openSenderModal.bind(this);
    this.closeSenderModal = this.closeSenderModal.bind(this);
    this.handleTransactionSuccess = this.handleTransactionSuccess.bind(this);
    this.handleTransactionFailure = this.handleTransactionFailure.bind(this);
    this.openScannerModal = this.openScannerModal.bind(this);
    this.closeScannerModal = this.closeScannerModal.bind(this);
    this.handleScannedCode = this.handleScannedCode.bind(this);
  }

  openSenderModal() {
    this.setState({ isSenderModalVisible: true });
  }

  closeSenderModal() {
    this.setState({ isSenderModalVisible: false });
  }

  handleTransactionSuccess() {
    console.warn('success!');
    this.closeSenderModal();
  }

  handleTransactionFailure() {
    console.warn('FAILURE!');
    this.closeSenderModal();
  }

  openScannerModal() {
    this.setState({ isScannerModalVisible: true });
  }

  closeScannerModal() {
    this.setState({ isScannerModalVisible: false });
  }

  handleScannedCode(result) {
    console.warn(result);
    this.closeScannerModal();
  }

  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Send Screen</Text>
        <Button title="Scan Code" onPress={this.openScannerModal} />

        <Text>New transaction</Text>
        <Button title="Open Transaction Modal" onPress={this.openSenderModal} />

        <Modal
          isVisible={this.state.isScannerModalVisible}
          style={modalStyle.modal}
        >
          <BarCodeScanner
            onCancel={this.closeScannerModal}
            onCodeScan={this.handleScannedCode}
            decoder={decodePublicKey}
          />
        </Modal>
        <Modal
          isVisible={this.state.isSenderModalVisible}
          style={modalStyle.modal}
        >
          <TransactionSender
            onCancel={this.closeSenderModal}
            onSuccess={this.handleTransactionSuccess}
            onFailure={this.handleTransactionFailure}
          />
        </Modal>
      </View>
    );
  }
}

SendScreen.propTypes = {};

export default SendScreen;
