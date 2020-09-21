import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  Image,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TextInput,
  Alert,
} from 'react-native';
import * as Yup from 'yup';
import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import getValidationErrors from '../../utils/getValidationErrors';
import api from '../../services/api';

import Input from '../../components/Input';
import Button from '../../components/Button';

import { Container, Title, BackToSignIn, BackToSignInText } from './styles';

import logoImg from '../../assets/logo.png';

interface SignUpFormData {
  name: string;
  email: string;
  password: string;
}

const SignUp: React.FC = () => {
  const [showCreateAccount, setShowCreateAccount] = useState(true);
  const navigation = useNavigation();
  const formRef = useRef<FormHandles>(null);
  const passwordInputRef = useRef<TextInput>(null);
  const emailInputRef = useRef<TextInput>(null);

  const keyboardDidShow = () => {
    setShowCreateAccount(false);
  };

  const keyboardDidHide = () => {
    setShowCreateAccount(true);
  };

  useEffect(() => {
    if (Platform.OS === 'android') {
      Keyboard.addListener('keyboardDidShow', keyboardDidShow);
      Keyboard.addListener('keyboardDidHide', keyboardDidHide);
    }
    // cleanup function
    return () => {
      if (Platform.OS === 'android') {
        Keyboard.removeListener('keyboardDidShow', keyboardDidShow);
        Keyboard.removeListener('keyboardDidHide', keyboardDidHide);
      }
    };
  }, []);

  const handleSubmit = useCallback(async (data: SignUpFormData) => {
    try {
      formRef.current?.setErrors({});

      const schema = Yup.object().shape({
        name: Yup.string().required('Name is required'),
        email: Yup.string()
          .email('Invalid email adress')
          .required('Email is required'),
        password: Yup.string().min(
          6,
          'Password must have at least 6 characters',
        ),
      });

      await schema.validate(data, {
        abortEarly: false,
      });

      await api.post('/users', data);

      Alert.alert('Signed up successfully', 'You can now log in to the app');
      navigation.goBack();
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const errors = getValidationErrors(err);
        formRef.current?.setErrors(errors);
        return;
      }

      Alert.alert(
        'Sign up error',
        'An error occured creating your account, please try again',
      );
    }
  }, []);

  return (
    <>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        enabled
      >
        <ScrollView
          contentContainerStyle={{ flex: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <Container>
            <Image source={logoImg} />

            <View>
              <Title>Create an account</Title>
            </View>

            <Form ref={formRef} onSubmit={handleSubmit}>
              <Input
                autoCorrect={false}
                autoCapitalize="words"
                keyboardType="default"
                name="name"
                icon="user"
                placeholder="Name"
                returnKeyType="next"
                onSubmitEditing={() => emailInputRef.current?.focus()}
              />
              <Input
                ref={emailInputRef}
                autoCorrect={false}
                autoCapitalize="none"
                keyboardType="email-address"
                name="email"
                icon="mail"
                placeholder="E-mail"
                returnKeyType="next"
                onSubmitEditing={() => passwordInputRef.current?.focus()}
              />
              <Input
                ref={passwordInputRef}
                secureTextEntry
                name="password"
                icon="lock"
                placeholder="Password"
                returnKeyType="send"
                textContentType="newPassword"
                onSubmitEditing={() => formRef.current?.submitForm()}
              />
            </Form>

            <Button
              onPress={() => {
                formRef.current?.submitForm();
              }}
            >
              Register
            </Button>
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>
      {showCreateAccount && (
        <BackToSignIn onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={20} color="#fff" />
          <BackToSignInText>Back to login</BackToSignInText>
        </BackToSignIn>
      )}
    </>
  );
};

export default SignUp;
