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
import ImagePicker from 'react-native-image-picker';
import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import getValidationErrors from '../../utils/getValidationErrors';
import api from '../../services/api';

import Input from '../../components/Input';
import Button from '../../components/Button';

import {
  Container,
  Title,
  UserAvatarButton,
  UserAvatar,
  BackButton,
} from './styles';
import { useAuth } from '../../hooks/Auth';

interface ProfileFormData {
  name: string;
  email: string;
  old_password: string;
  password: string;
  password_confirmation: string;
}

const Profile: React.FC = () => {
  const navigation = useNavigation();
  const formRef = useRef<FormHandles>(null);
  const passwordInputRef = useRef<TextInput>(null);
  const newPasswordInputRef = useRef<TextInput>(null);
  const newPasswordConfirmInputRef = useRef<TextInput>(null);
  const emailInputRef = useRef<TextInput>(null);
  const { user, updateUser } = useAuth();

  const [showAvatarImage, setShowAvatarImage] = useState(true);

  const keyboardDidShow = () => {
    setShowAvatarImage(false);
  };

  const keyboardDidHide = () => {
    setShowAvatarImage(true);
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

  const handleUpdateAvatar = useCallback(() => {
    ImagePicker.showImagePicker(
      {
        title: 'Select Avatar',
      },
      response => {
        if (response.didCancel) {
          return;
        }
        if (response.error) {
          Alert.alert('Error changing your avatar');
          return;
        }

        const source = { uri: response.uri };

        const data = new FormData();
        data.append('avatar', {
          uri: response.uri,
          type: 'image/jpeg',
          name: `${user.id}.jpg`,
        });

        api.patch('users/avatar', data).then(apiResponse => {
          updateUser(apiResponse.data);
        });
      },
    );
  }, [updateUser, user.id]);

  const handleSubmit = useCallback(
    async (data: ProfileFormData) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          name: Yup.string().required('Name is required'),
          email: Yup.string()
            .email('Invalid email adress')
            .required('Email is required'),
          old_password: Yup.string(),
          password: Yup.string().when('old_password', {
            is: val => !!val.length,
            then: Yup.string().min(
              6,
              'Password must have at least 6 characters',
            ),
            otherwise: Yup.string(),
          }),
          password_confirmation: Yup.string()
            .when('old_password', {
              is: val => !!val.length,
              then: Yup.string().required(),
              otherwise: Yup.string(),
            })
            .oneOf([Yup.ref('password')], 'Passwords must match'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        const {
          name,
          email,
          old_password,
          password,
          password_confirmation,
        } = data;

        const formData = {
          name,
          email,
          ...(data.old_password
            ? {
                old_password,
                password,
                password_confirmation,
              }
            : {}),
        };

        const response = await api.put('/profile', formData);
        updateUser(response.data);

        Alert.alert('Profile updated successfully');
        navigation.goBack();
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);
          formRef.current?.setErrors(errors);
          return;
        }

        Alert.alert(
          'Profile update error',
          'An error occured updating your profile, please try again',
        );
      }
    },
    [navigation, updateUser],
  );

  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return (
    <>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={200}
        enabled
      >
        <ScrollView
          contentContainerStyle={{ flex: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <Container>
            {showAvatarImage && (
              <>
                <BackButton onPress={handleGoBack}>
                  <Icon name="chevron-left" size={24} color="#999591" />
                </BackButton>
                <UserAvatarButton onPress={handleUpdateAvatar}>
                  <UserAvatar source={{ uri: user.avatar_url }} />
                </UserAvatarButton>
                <View>
                  <Title>My Profile</Title>
                </View>
              </>
            )}

            <Form initialData={user} ref={formRef} onSubmit={handleSubmit}>
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
                name="old_password"
                icon="lock"
                containerStyle={{ marginTop: 16 }}
                placeholder="Password"
                returnKeyType="next"
                textContentType="newPassword"
                onSubmitEditing={() => newPasswordInputRef.current?.focus()}
              />

              <Input
                ref={newPasswordInputRef}
                secureTextEntry
                name="password"
                icon="lock"
                placeholder="New password"
                returnKeyType="next"
                textContentType="newPassword"
                onSubmitEditing={() => {
                  newPasswordConfirmInputRef.current?.focus();
                }}
              />

              <Input
                ref={newPasswordConfirmInputRef}
                secureTextEntry
                name="password_confirmation"
                icon="lock"
                placeholder="New password confirmation"
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
              Update
            </Button>
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
};

export default Profile;
