'use client';

import { SubmitHandler, useForm } from 'react-hook-form';
import Field from '../ui/Field';
import {
  useLoginMutation,
  useRegisterMutation,
} from '@/src/graphql/generated/client';
import { useRouter } from 'next/navigation';
import { capitalizeFirstLetter } from '../../utils/capitalizeFirstLetter';

interface IUsernamePassword {
  username: string;
  email?: string;
  password: string;
}

interface FieldError {
  field: 'username' | 'password';
  message: string;
}

const Auth = ({ type }: { type: 'login' | 'register' }) => {
  //const [type, setType] = useState<'login' | 'register'>('login');
  const [, register] = useRegisterMutation();
  const [, login] = useLoginMutation();

  const {
    register: formRegister,
    handleSubmit,
    setError,
    formState: { errors },
    reset,
  } = useForm<IUsernamePassword>({
    mode: 'onChange',
  });

  const router = useRouter();

  const onSubmit: SubmitHandler<IUsernamePassword> = async (data) => {
    const { email, ...dataWithoutEmail } = data;
    const response =
      type === 'login'
        ? await login(dataWithoutEmail)
        : await register({ ...data, email: email! });

    if (response.data.register?.errors) {
      response.data.register.errors.map((error: FieldError) =>
        setError(error.field, { type: 'manual', message: error.message }),
      );
    } else if (response.data.login?.errors) {
      response.data.login.errors.map((error: FieldError) =>
        setError(error.field, { type: 'manual', message: error.message }),
      );
    } else {
      reset();
      router.push('/');
    }
  };

  return (
    <main className="flex grow items-center p-6 md:px-24 lg:px-48">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="m-auto rounded-lg bg-white p-8 shadow-sm"
      >
        <h1 className="mb-4 text-center text-3xl font-semibold capitalize">
          {type}
        </h1>
        <Field
          {...formRegister('username', {
            required: 'username is required',
          })}
          placeholder={'username'}
          error={errors.username?.message}
        />
        {type === 'register' && (
          <Field
            {...formRegister('email', {
              required: 'email is required',
            })}
            placeholder={'email'}
            error={errors.email?.message}
          />
        )}
        <Field
          {...formRegister('password', {
            required: 'Password is required',
          })}
          type="password"
          placeholder={'password'}
          error={errors.password?.message}
        />

        <div className="flex gap-5">
          <button
            className="rounded bg-teal-600 px-4 py-2 text-white"
            type="submit"
          >
            {capitalizeFirstLetter(type)}
          </button>
          <button
            type="button"
            className="inline-block text-sm capitalize opacity-20"
            onClick={() =>
              router.push(type === 'login' ? '/register' : '/login')
            }
          >
            {capitalizeFirstLetter(type === 'login' ? 'register' : 'login')}
          </button>
        </div>
        {type === 'login' && (
          <button
            type="button"
            className="mt-3 inline-block text-sm text-teal-500 capitalize"
            onClick={() => router.push('/forgot-password')}
          >
            Forgot password
          </button>
        )}
      </form>
    </main>
  );
};

export default Auth;
