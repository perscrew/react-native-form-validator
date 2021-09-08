import React, { useState } from 'react';
import { View, Text, TextInput, TouchableHighlight } from 'react-native';
import { useValidation } from '../src/index';

const FunctionalFormTest = () => {
  const [name, setName] = useState('');
  const [pseudo, setPseudo] = useState('');
  const [email, setEmail] = useState('');
  const [number, setNumber] = useState('');
  const [date, setDate] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const { validate, isFieldInError, getErrorsInField, getErrorMessages } = useValidation({
    state: { name, email, pseudo, number, date, newPassword, confirmPassword }
  });

  const _onPressButton = () => {
    validate({
      name: { minlength: 3, maxlength: 7, required: true },
      pseudo: { required: true },
      email: { email: true },
      number: { numbers: true },
      date: { date: 'YYYY-MM-DD' },
      confirmPassword: { equalPassword: newPassword }
    });
  };

  return (
    <View>
      <TextInput onChangeText={setName} value={name} />
      {isFieldInError('name') &&
        getErrorsInField('name').map((errorMessage) => <Text key="nameError">{errorMessage}</Text>)}
      
      <TextInput onChangeText={setPseudo} value={pseudo} />
      {isFieldInError('pseudo') &&
        getErrorsInField('pseudo').map((errorMessage) => <Text key="pseudoError">{errorMessage}</Text>)}
      
      <TextInput onChangeText={setEmail} value={email} />
      {isFieldInError('email') &&
        getErrorsInField('email').map((errorMessage) => <Text key="emailError">{errorMessage}</Text>)}
      
      <TextInput onChangeText={setNumber} value={number} />
      {isFieldInError('number') && getErrorsInField('number').map((errorMessage) => <Text key="numberError">{errorMessage}</Text>)}

      <TextInput onChangeText={setDate} value={date} />
      {isFieldInError('date') && getErrorsInField('date').map((errorMessage) => <Text key="dateError">{errorMessage}</Text>)}

      <TextInput onChangeText={setNewPassword} value={newPassword} secureTextEntry={true} />
      <TextInput onChangeText={setConfirmPassword} value={confirmPassword} secureTextEntry={true} />
      {isFieldInError('confirmPassword') &&
        getErrorsInField('confirmPassword').map((errorMessage) => <Text key="confirmError">{errorMessage}</Text>)}

      <TouchableHighlight onPress={_onPressButton}>
        <Text>Submit</Text>
      </TouchableHighlight>

      <Text>{getErrorMessages()}</Text>
    </View>
  );
};

export default FunctionalFormTest;
