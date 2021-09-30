import { defaultMessages, defaultRules } from 'react-native-form-validator';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import ClassForm from './components/ClassForm';
import FunctionForm from './components/FunctionForm';
import Layout from './layout/Layout';

const fieldsValidation = {
  civility: { required: true, customCivilityRule: true },
  email: { required: true, email: true },
  firstName: { required: true, minlength: 2, maxlength: 6 },
  lastName: { required: true }
};

function App() {
  const rules = { ...defaultRules, customCivilityRule: /^(Mrs|Ms|Miss)$/ };
  const messages = {
    ...defaultMessages,
    en: { ...defaultMessages['en'], customCivilityRule: 'Civility is incorrect (Mrs/Ms/Miss)' }
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate replace to="/function-form" />} />
          <Route path="/function-form" element={<FunctionForm validation={fieldsValidation} />} />
          <Route
            path="/class-form"
            element={<ClassForm rules={rules} messages={messages} validation={fieldsValidation} />}
          />
        </Route>
        <Route path="*" element={<Navigate to="/function-form" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
