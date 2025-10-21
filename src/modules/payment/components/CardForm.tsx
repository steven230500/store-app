import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import { setCard } from '../redux/paymentSlice';
import { detectBrand, luhnCheck } from '../utils/detectBrand';
import { Button } from '../../../modules/ui';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface CardFormProps {
  onSubmit: () => void;
  onCancel: () => void;
}

interface CardFormData {
  number: string;
  name: string;
  email: string;
  expiry: string;
  cvv: string;
}

interface ValidationErrors {
  number?: string;
  name?: string;
  email?: string;
  expiry?: string;
  cvv?: string;
}

export const CardForm: React.FC<CardFormProps> = ({ onSubmit, onCancel }) => {
  const dispatch = useDispatch();
  const [cardBrand, setCardBrand] = useState<'VISA' | 'MASTERCARD' | undefined>();
  const [focusedField, setFocusedField] = useState<keyof CardFormData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<CardFormData>({
    number: '',
    name: '',
    email: '',
    expiry: '',
    cvv: '',
  });
  const [errors, setErrors] = useState<ValidationErrors>({});

  const validateCardNumber = (value: string): string | undefined => {
    const cleanValue = value.replace(/\s/g, '');
    if (!cleanValue) return 'Número de tarjeta requerido';
    if (!/^\d{13,19}$/.test(cleanValue)) return 'Número de tarjeta inválido';
    if (!luhnCheck(cleanValue)) return 'Número de tarjeta inválido';
    return undefined;
  };

  const validateName = (value: string): string | undefined => {
    if (!value) return 'Nombre requerido';
    if (value.length < 2) return 'Nombre muy corto';
    if (value.length > 50) return 'Nombre muy largo';
    if (!/^[a-zA-Z\s]+$/.test(value)) return 'Solo letras y espacios';
    return undefined;
  };

  const validateEmail = (value: string): string | undefined => {
    if (!value) return 'Email requerido';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Email inválido';
    return undefined;
  };

  const validateExpiry = (value: string): string | undefined => {
    if (!value) return 'Fecha de expiración requerida';
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(value)) return 'Formato MM/YY';

    const parts = value.split('/');
    if (parts.length !== 2) return 'Formato MM/YY';

    const month = parts[0] || '';
    const year = parts[1] || '';
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100;
    const currentMonth = currentDate.getMonth() + 1;

    const expMonth = parseInt(month, 10);
    const expYear = parseInt(year, 10);

    if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
      return 'Tarjeta expirada';
    }
    return undefined;
  };

  const validateCvv = (value: string): string | undefined => {
    if (!value) return 'CVV requerido';
    if (!/^\d{3,4}$/.test(value)) return 'CVV debe tener 3-4 dígitos';
    return undefined;
  };

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {
      number: validateCardNumber(formData.number),
      name: validateName(formData.name),
      email: validateEmail(formData.email),
      expiry: validateExpiry(formData.expiry),
      cvv: validateCvv(formData.cvv),
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== undefined);
  };

  const isFormValid = (): boolean => {
    const { number, name, email, expiry, cvv } = formData;
    return (
      !validateCardNumber(number) &&
      !validateName(name) &&
      !validateEmail(email) &&
      !validateExpiry(expiry) &&
      !validateCvv(cvv)
    );
  };

  useEffect(() => {
    if (formData.number) {
      const brand = detectBrand(formData.number.replace(/\s/g, ''));
      setCardBrand(brand);
    } else {
      setCardBrand(undefined);
    }
  }, [formData.number]);

  const handleInputChange = (field: keyof CardFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleFocus = (field: keyof CardFormData) => {
    setFocusedField(field);
  };

  const handleBlur = () => {
    setFocusedField(null);
  };

  const onFormSubmit = async () => {
   if (!validateForm()) return;

   setIsSubmitting(true);
   try {
     const expiryParts = formData.expiry.split('/');
     const expMonth = expiryParts[0];
     const expYear = expiryParts[1];

     console.log('Enviando datos de tarjeta al Redux:', {
       number: formData.number.replace(/\s/g, ''),
       cvc: formData.cvv,
       exp_month: expMonth,
       exp_year: expYear,
       card_holder: formData.name,
       email: formData.email,
       brand: cardBrand,
       bin: formData.number.replace(/\s/g, '').slice(0, 6),
       last4: formData.number.replace(/\s/g, '').slice(-4),
     });

     dispatch(setCard({
       number: formData.number.replace(/\s/g, ''),
       cvc: formData.cvv,
       exp_month: expMonth,
       exp_year: expYear,
       brand: cardBrand || undefined,
       bin: formData.number.replace(/\s/g, '').slice(0, 6),
       last4: formData.number.replace(/\s/g, '').slice(-4),
       card_holder: formData.name,
       email: formData.email,
     }));
     await onSubmit();
   } finally {
     setIsSubmitting(false);
   }
 };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\D/g, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const handleExpiryChange = (text: string) => {
    if (text.length < formData.expiry.length) {
      handleInputChange('expiry', text);
    } else {
      const formatted = formatExpiry(text);
      handleInputChange('expiry', formatted);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Información de la tarjeta</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Número de tarjeta</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            style={[styles.input, focusedField === 'number' && styles.inputFocused]}
            placeholder="1234 5678 9012 3456"
            keyboardType="numeric"
            value={formData.number}
            onChangeText={(text) => {
              const formatted = formatCardNumber(text);
              handleInputChange('number', formatted);
            }}
            onFocus={() => handleFocus('number')}
            onBlur={handleBlur}
            maxLength={19}
          />
          {cardBrand && (
            <View style={styles.brandIcon}>
              <Icon
                name={cardBrand === 'VISA' ? 'credit-card' : 'credit-card-outline'}
                size={24}
                color="#007bff"
              />
            </View>
          )}
        </View>
        {errors.number && <Text style={styles.error}>{errors.number}</Text>}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Nombre del titular</Text>
        <TextInput
          style={[styles.input, focusedField === 'name' && styles.inputFocused]}
          placeholder="Juan Pérez"
          value={formData.name}
          onChangeText={(text) => handleInputChange('name', text)}
          onFocus={() => handleFocus('name')}
          onBlur={handleBlur}
          autoCapitalize="words"
        />
        {errors.name && <Text style={styles.error}>{errors.name}</Text>}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={[styles.input, focusedField === 'email' && styles.inputFocused]}
          placeholder="user@example.com"
          keyboardType="email-address"
          value={formData.email}
          onChangeText={(text) => handleInputChange('email', text)}
          onFocus={() => handleFocus('email')}
          onBlur={handleBlur}
          autoCapitalize="none"
        />
        {errors.email && <Text style={styles.error}>{errors.email}</Text>}
      </View>

      <View style={styles.row}>
        <View style={[styles.inputContainer, styles.half]}>
          <Text style={styles.label}>Fecha de expiración</Text>
          <TextInput
            style={[styles.input, focusedField === 'expiry' && styles.inputFocused]}
            placeholder="MM/YY"
            keyboardType="numeric"
            value={formData.expiry}
            onChangeText={handleExpiryChange}
            onFocus={() => handleFocus('expiry')}
            onBlur={handleBlur}
            maxLength={5}
          />
          {errors.expiry && <Text style={styles.error}>{errors.expiry}</Text>}
        </View>

        <View style={[styles.inputContainer, styles.half]}>
          <Text style={styles.label}>CVV</Text>
          <TextInput
            style={[styles.input, focusedField === 'cvv' && styles.inputFocused]}
            placeholder="123"
            keyboardType="numeric"
            value={formData.cvv}
            onChangeText={(text) => handleInputChange('cvv', text)}
            onFocus={() => handleFocus('cvv')}
            onBlur={handleBlur}
            maxLength={4}
            secureTextEntry
          />
          {errors.cvv && <Text style={styles.error}>{errors.cvv}</Text>}
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Cancelar"
          onPress={onCancel}
          variant="secondary"
          style={styles.button}
        />
        <Button
          title={isSubmitting ? "Procesando..." : "Continuar"}
          onPress={onFormSubmit}
          disabled={!isFormValid() || isSubmitting}
          loading={isSubmitting}
          style={styles.button}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 32,
    color: '#212529',
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#495057',
  },
  inputWrapper: {
    position: 'relative',
  },
  input: {
    borderWidth: 2,
    borderColor: '#e9ecef',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  inputFocused: {
    borderColor: '#007bff',
    shadowOpacity: 0.1,
    elevation: 4,
  },
  brandIcon: {
    position: 'absolute',
    right: 16,
    top: 16,
  },
  error: {
    color: '#dc3545',
    fontSize: 14,
    marginTop: 6,
    fontWeight: '500',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  half: {
    width: '48%',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 32,
    gap: 12,
  },
  button: {
    flex: 1,
  },
});