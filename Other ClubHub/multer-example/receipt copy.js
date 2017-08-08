import React from 'react';
import { connect } from 'react-redux';
import {
  AsyncStorage,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ListView,
  Alert,
  Button,
  Image,
  AppRegistry,
  Dimensions,
  TouchableHighlight,
  ImageBackground,
} from 'react-native';
import FormData from "../../../../node_modules/react-native/Libraries/Network/FormData"
import styles from '../../../style.js'
import { StackNavigator } from 'react-navigation';
import Footer from '../footer';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import CameraIcon from 'react-native-vector-icons/Entypo'
import Camera from 'react-native-camera';
import axios from 'axios';

import { RNS3 } from 'react-native-aws3';

//COMPONENTS
import Form from './receipt/form';

class Receipt extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    headerStyle: {backgroundColor: "#ee593b"},
    title: "Receipt",
    tabBarIcon: <Icon name="receipt" size={30} color="#f5c151" />
  });
  constructor() {
    super()
    this.state = {
      camera: true,
      registration: false,
      data: null,
      reqBy: null,
      amount: null,
      imageLink: null,
    }
    this.setText = this.setText.bind(this);
    this.setAmount = this.setAmount.bind(this);
    this.sendForm = this.sendForm.bind(this);
  }
  setText(text) {
    this.setState({reqBy: text})
  }
  setAmount(number) {
    this.setState({amount: number})
  }
  sendForm() {
    fetch('https://47e151ce.ngrok.io/api/uploadform', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        reqBy: this.state.reqBy,
        amount: this.state.amount,
        filename: this.state.filename,
        imageLink: this.state.imageLink
      })
    }).then((response) => {
      if (response.ok) {
        console.log('success')
      }
      else {
        console.log('error')
      }
      this.setState({registration: false, camera: true})
      return;
    })
    .catch(err => console.error(err));
  }

  render() {
    if (this.state.registration) {
      return (
        <Form
          setText={this.setText}
          setAmount={this.setAmount}
          sendForm={this.sendForm}
        />
          );
        }
        else if (this.state.camera) {
          return (
            <View style={styles.camcontainer}>
              <Camera
                ref={(cam) => {
                  this.camera = cam;
                }}
                style={styles.preview}
                captureTarget={Camera.constants.CaptureTarget.disk}
                defaultOnFocusComponent={true}
                mirrorImage={true}
                aspect={Camera.constants.Aspect.fill}>
                <Text style={styles.capture} onPress={this.takePicture.bind(this)}><CameraIcon name="camera" size={70} color="#f5c151" /></Text>
              </Camera>
            </View>
          );
        }
        else {
          return (
            <ImageBackground
              source={{uri: this.state.data.path}}
              style={styles.receiptImage}
              >
                <TouchableOpacity style={[styles.buttonSolidYellow]}
                  onPress={() => (this.setState({camera: true}))}>
                  <Text style={styles.buttonLabelWhite}>Retake</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.buttonSolidYellow]}
                  onPress={this.sendPicture.bind(this)}>
                  <Text style={styles.buttonLabelWhite}>Looks Good!</Text>
                </TouchableOpacity>
              </ImageBackground>
            );
          }
        }

        takePicture() {
          const options = {};
          this.camera.capture({metadata: options})
          .then((data) => {
            this.setState({data: data})
            this.setState({camera: false})
          })
        }

        sendPicture() {
          this.setState({registration: true, camera: false})
          //Sending data to the server
          console.log('sending data...');
          // //UPLOAD to s3
          const file = {
            uri: this.state.data.path,
            name: this.props.user.clubName + Date.now() + 'receipt.jpg',
            type: "image/jpg"
          }
          const options = {
            keyPrefix: "uploads/",
            bucket: "clubhub3739",
            region: "ca-central-1",
            accessKey: "AKIAIS7VISPGSA4XFDSA",
            secretKey: "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",
            successActionStatus: 201
          }
          RNS3.put(file, options).then(response => {
            if (response.status !== 201) {
              console.log('failed')
            throw new Error("Failed to upload image to S3");
           }
           else {
            console.log("RNS3", response.body.postResponse);
            this.setState({imageLink: response.body.postResponse.location})
            console.log(this.state.imageLink);
           }
          })
          .catch(err => console.log('error', err));
          //end of s3 upload

          const form = new FormData();
          form.append("receipt", {uri: this.state.data.path, name: this.props.user.clubName + Date.now() + 'receipt.jpg', type: 'multipart/form-data'})

          const config = { headers: { 'Content-Type': 'multipart/form-data' } };
          axios.post('https://47e151ce.ngrok.io/api/upload', form, config)
          .then(({ data }) => {
            console.log('receiving data...', data);
            this.setState({filename: data.filename})
            console.log('state', this.state.filename)
          })
          .catch(err => console.error(err));
        }

      }

      function mapStateToProps(state) { //filters store.getState into a usable format
        return {
          user: state //array of users
        };
      }

      function mapDispatchToProps(dispatch) {
        return {
          makeuser: (data) => {
            dispatch(makeuser(data)); //carries object to the reducer based on the CASE
          },
        };
      }

      Receipt = connect( //connect integrates redux
        mapStateToProps,
        mapDispatchToProps
      )(Receipt);

      export default Receipt
