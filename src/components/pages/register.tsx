'use client';

import { SubmitHandler, useForm } from 'react-hook-form';
import { useMutation } from 'urql';
import { useRegisterMutation } from '../../generated/graphql';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface IRegisterProps {}

interface IUsernamePassword {
  username: string;
  password: string;
}

interface FieldError {
  field: string;
  message: string;
}

const Register = (props: IRegisterProps) => {
  const { register, handleSubmit } = useForm<IUsernamePassword>();

  const [errors, setErrors] = useState<FieldError[]>([]);
  const getErrorByField = (field: string) => {
    return errors.filter((error) => error.field == field)[0]?.message;
  };

  const router = useRouter();

  const [, mutation] = useRegisterMutation();

  const onSubmit: SubmitHandler<IUsernamePassword> = async (
    data: IUsernamePassword,
  ) => {
    const response = await mutation(data);
    if (response.data.register.errors) {
      setErrors(response.data.register.errors);
    } else {
      router.push('/');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mx-auto mt-10 w-1/2">
      <h1 className="font-medium">Username</h1>
      <input
        className="my-2 w-full rounded-md border border-solid border-gray-300 px-4 py-2 text-sm transition-all outline-none placeholder:text-gray-300"
        placeholder={'username'}
        {...register('username', { required: true })}
      />
      <p className="text-red-500">{getErrorByField('username')}</p>

      <h1 className="font-medium">Password</h1>
      <input
        className="my-2 w-full rounded-md border border-solid border-gray-300 px-4 py-2 text-sm transition-all outline-none placeholder:text-gray-300"
        type="password"
        placeholder={'password'}
        {...register('password', { required: true })}
      />
      <p className="text-red-500">{getErrorByField('password')}</p>

      <button
        className="rounded bg-teal-600 px-4 py-2 text-white"
        type="submit"
      >
        Register
      </button>
    </form>
  );
};

export default Register;
