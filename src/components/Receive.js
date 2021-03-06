import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Icon,
  Container,
  Header,
  Left,
  Right,
  Body,
  Title,
  Content,
  Tab,
  Card,
  CardItem,
  Tabs
} from 'native-base';
import { Share, StyleSheet, View, Text } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { encodePublicKey } from '../lib/keypairHelpers';
import qrCodeLogo from '../../assets/img/logo-round.png';

export class Receive extends Component {
  constructor(props) {
    super(props);
    this.state = {
      qrCodeWidth: null
    };

    this.setQRCodeWidth = this.setQRCodeWidth.bind(this);
    this.openShareMenu = this.openShareMenu.bind(this);
  }

  setQRCodeWidth(event) {
    const { x, y, width, height } = event.nativeEvent.layout;

    this.setState({ qrCodeWidth: width });
  }

  openShareMenu() {
    const title = 'CNDY public key';
    const message = `This is my public key on CNDY:
      ${this.props.keypair.publicKey()}
    `;

    Share.share({ title, message });
  }

  renderQRCode() {
    if (!this.state.qrCodeWidth) return null;

    const url = encodePublicKey(this.props.keypair.publicKey());
    return (
      <QRCode
        size={this.state.qrCodeWidth}
        value={url}
        logo={qrCodeLogo}
        logoBackgroundColor="transparent"
        elc="M"
      />
    );
  }

  render() {
    return (
      <Content padder>
        <Card>
          <CardItem cardBody onLayout={this.setQRCodeWidth}>
            {this.renderQRCode()}
          </CardItem>
        </Card>
        <Card>
          <CardItem header>
            <Text>
              This is your public key: {this.props.keypair.publicKey()}
            </Text>
          </CardItem>
          <CardItem button onPress={this.openShareMenu}>
            <Icon active name="share" />
            <Text>Share public key to receive CNDY</Text>
          </CardItem>
        </Card>
      </Content>
    );
  }
}

Receive.propTypes = {
  keypair: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  keypair: state.keypair.keypair
});

const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Receive);
