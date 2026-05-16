import React from 'react';
import { useForm } from 'react-hook-form';
import { Mail, Lock, User, Shield } from 'lucide-react';
import { RegisterCredentials, UserRole } from '../../types';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';

interface RegisterFormProps {
  onSubmit: (data: RegisterCredentials) => Promise<void>;
  loading?: boolean;
  onSwitchToLogin: () => void;
}

const roleOptions = [
  { value: UserRole.SALES, label: 'Sales User' },
  { value: UserRole.ADMIN, label: 'Admin' },
];

const RegisterForm: React.FC<RegisterFormProps> = ({ onSubmit, loading, onSwitchToLogin }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterCredentials>({ defaultValues: { role: UserRole.SALES } });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Input
        label="Full Name"
        placeholder="Jane Doe"
        autoComplete="name"
        icon={<User size={16} />}
        error={errors.name?.message}
        {...register('name', {
          required: 'Name is required',
          minLength: { value: 2, message: 'Name must be at least 2 characters' },
        })}
      />
      <Input
        label="Email Address"
        type="email"
        placeholder="you@example.com"
        autoComplete="email"
        icon={<Mail size={16} />}
        error={errors.email?.message}
        {...register('email', {
          required: 'Email is required',
          pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email address' },
        })}
      />
      <Input
        label="Password"
        type="password"
        placeholder="Min. 6 characters"
        autoComplete="new-password"
        icon={<Lock size={16} />}
        error={errors.password?.message}
        {...register('password', {
          required: 'Password is required',
          minLength: { value: 6, message: 'Password must be at least 6 characters' },
        })}
      />
      <Select
        label="Role"
        options={roleOptions}
        {...register('role')}
      />
      <Button type="submit" loading={loading} size="lg" className="w-full mt-1">
        Create Account
      </Button>
      <p className="text-center text-sm text-gray-500 dark:text-gray-400">
        Already have an account?{' '}
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="text-brand-600 dark:text-brand-400 font-medium hover:underline"
        >
          Sign In
        </button>
      </p>
    </form>
  );
};

export default RegisterForm;
