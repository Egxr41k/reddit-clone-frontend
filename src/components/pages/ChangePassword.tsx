'use client';

import { useChangePasswordMutation } from '@/src/graphql/generated/client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import Field from '../ui/Field';

interface INewPassword {
  newPassword: string;
}

interface FieldError {
  field: 'newPassword' | 'token';
  message: string;
}

const ChangePassword = ({ token }: { token: string }) => {
  const [, changePassword] = useChangePasswordMutation();
  const [tokenError, setTokenError] = useState('');

  const {
    register: formRegister,
    handleSubmit,
    setError,
    formState: { errors },
    reset,
  } = useForm<INewPassword>({
    mode: 'onChange',
  });

  const router = useRouter();

  const onSubmit: SubmitHandler<INewPassword> = async (data) => {
    const response = await changePassword({
      token,
      newPassword: data.newPassword,
    });

    if (response.data?.changePassword.errors) {
      console.log(response.data?.changePassword.errors);
      response.data?.changePassword.errors.map((error) => {
        if (error.field == 'token') {
          setTokenError(error.message);
        } else if (error.field == 'newPassword') {
          setError(error.field, { type: 'manual', message: error.message });
        }
      });
    } else if (response.data?.changePassword.user) {
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
        {/* <h1 className="mb-4 text-center text-3xl font-semibold capitalize">
          Change Password
        </h1> */}

        <Field
          {...formRegister('newPassword', {
            required: 'new password is required',
          })}
          type="password"
          placeholder={'new password'}
          error={errors.newPassword?.message}
        />

        {tokenError && (
          <>
            <p className="my-1 text-sm text-red-500">{tokenError}</p>
            <Link href="/forgot-password">click here to get a new one</Link>
          </>
        )}

        <div className="flex gap-5">
          <button
            className="rounded bg-teal-600 px-4 py-2 text-white"
            type="submit"
          >
            Change Password
          </button>
        </div>
      </form>
    </main>
  );
};

export default ChangePassword;
