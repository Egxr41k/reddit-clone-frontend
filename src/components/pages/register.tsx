'use client';

import { SubmitHandler, useForm } from 'react-hook-form';
import { useMutation } from 'urql';

interface IRegisterProps {}

interface IUsernamePassword {
  username: string;
  password: string;
}

const REGISTER_MUT = `
mutation :ogin($username: String!, $password: String!) {
  register(options: {username: $username, password: $password}) {
    errors {
      field
      message
    }
    user {
      id
      username
    }
  }
}
`;

const Register = (props: IRegisterProps) => {
  const { register, handleSubmit } = useForm<IUsernamePassword>();

  const [, mutation] = useMutation(REGISTER_MUT);

  const onSubmit: SubmitHandler<IUsernamePassword> = (
    data: IUsernamePassword,
  ) => {
    const response = mutation(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mx-auto mt-10 w-1/2">
      <h1 className="font-medium">Username</h1>
      <input
        className="my-2 w-full rounded-md border border-solid border-gray-300 px-4 py-2 text-sm transition-all outline-none placeholder:text-gray-300"
        placeholder={'username'}
        {...register('username', { required: true })}
      />

      <h1 className="font-medium">Password</h1>
      <input
        className="my-2 w-full rounded-md border border-solid border-gray-300 px-4 py-2 text-sm transition-all outline-none placeholder:text-gray-300"
        type="password"
        placeholder={'password'}
        {...register('password', { required: true })}
      />
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
