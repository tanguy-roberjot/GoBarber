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
import { useAuth } from '../../hooks/Auth';
import getValidationErrors from '../../utils/getValidationErrors';
import Input from '../../components/Input';
import Button from '../../components/Button';

import {
  Container,
  Title,
  ForgotPassword,
  ForgotPasswordText,
  CreateAccountButton,
  CreateAccountButtonText,
} from './styles';

import logoImg from '../../assets/logo.png';

export interface SignInFormData {
  email: string;
  password: string;
}

const SignIn: React.FC = () => {
  const [showCreateAccount, setShowCreateAccount] = useState(true);
  const navigation = useNavigation();
  const formRef = useRef<FormHandles>(null);
  const passwordInputRef = useRef<TextInput>(null);

  const { signIn } = useAuth();

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

  const handleSubmit = useCallback(async (data: SignInFormData) => {
    try {
      formRef.current?.setErrors({});

      const schema = Yup.object().shape({
        email: Yup.string()
          .email('Invalid email adress')
          .required('Email is required'),
        password: Yup.string().required('Password is required'),
      });

      await schema.validate(data, {
        abortEarly: false,
      });

      await signIn({
        email: data.email,
        password: data.password,
      });
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const errors = getValidationErrors(err);
        formRef.current?.setErrors(errors);
        return;
      }

      Alert.alert(
        'Authentication error',
        'Login failed, please check your email/password',
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
              <Title>Log in to your account</Title>
            </View>

            <Form ref={formRef} onSubmit={handleSubmit}>
              <Input
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
                onSubmitEditing={() => formRef.current?.submitForm()}
              />
            </Form>

            <Button
              onPress={() => {
                formRef.current?.submitForm();
              }}
            >
              Entrar
            </Button>

            <ForgotPassword onPress={() => {}}>
              <ForgotPasswordText>Forgot my password</ForgotPasswordText>
            </ForgotPassword>
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>
      {showCreateAccount && (
        <CreateAccountButton onPress={() => navigation.navigate('SignUp')}>
          <Icon name="log-in" size={20} color="#ff9000" />
          <CreateAccountButtonText>Create an account</CreateAccountButtonText>
        </CreateAccountButton>
      )}
    </>
  );
};

export default SignIn;
