'use client';

import { useForgotPasswordMutation } from '@/src/graphql/generated/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import Field from '../ui/Field';

interface INewPassword {
  email: string;
}

interface FieldError {
  field: 'newPassword' | 'token';
  message: string;
}

const ForgotPassword = () => {
  const [complete, setComplete] = useState(false);
  const [, forgotPassword] = useForgotPasswordMutation();

  const {
    register: formRegister,
    handleSubmit,
    setError,
    formState: { errors },
    reset,
  } = useForm<{
    email: string;
  }>({
    mode: 'onChange',
  });

  const router = useRouter();

  const onSubmit: SubmitHandler<INewPassword> = async (data) => {
    const response = await forgotPassword({ email: data.email });

    setComplete(true);
  };

  return (
    <main className="flex grow items-center p-6 md:px-24 lg:px-48">
      {complete ? (
        <p className="my-1 text-sm">
          if an account with that email exists, we sent you can email
        </p>
      ) : (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="m-auto rounded-lg bg-white p-8 shadow-sm"
        >
          {/* <h1 className="mb-4 text-center text-3xl font-semibold capitalize">
          Change Password
        </h1> */}

          <Field
            {...formRegister('email', {
              required: 'email is required',
            })}
            type="text"
            placeholder={'email'}
            error={errors.email?.message}
          />

          <div className="flex gap-5">
            <button
              className="rounded bg-teal-600 px-4 py-2 text-white"
              type="submit"
            >
              submit
            </button>
          </div>
        </form>
      )}
    </main>
  );
};

export default ForgotPassword;
