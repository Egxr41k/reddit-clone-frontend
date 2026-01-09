'use client';

import { useCreatePostMutation } from '@/src/graphql/generated/client';
import { useIsAuth } from '@/src/hooks/useIsAuth';
import { useRouter } from 'next/navigation';
import { SubmitHandler, useForm } from 'react-hook-form';
import Field from '../ui/Field';

interface IPost {
  title: string;
  text: string;
}

interface FieldError {
  field: 'username' | 'password';
  message: string;
}

const CreatePost = () => {
  const [, createPost] = useCreatePostMutation();

  useIsAuth();

  const {
    register: formRegister,
    handleSubmit,
    setError,
    formState: { errors },
    reset,
  } = useForm<IPost>({
    mode: 'onChange',
  });

  const router = useRouter();

  const onSubmit: SubmitHandler<IPost> = async (data) => {
    console.log(data);
    const response = await createPost({ input: data });
    console.log(response);
    if (!response.error) router.push('/');
  };

  return (
    <main className="flex grow items-center p-6 md:px-24 lg:px-48">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="m-auto rounded-lg bg-white p-8 shadow-sm"
      >
        <h1 className="mb-4 text-center text-3xl font-semibold capitalize">
          Create post
        </h1>
        <Field
          {...formRegister('title', {
            required: 'title is required',
          })}
          placeholder={'title'}
          error={errors.title?.message}
        />
        <textarea
          {...formRegister('text', {
            required: 'text is required',
          })}
          placeholder={'text'}
          className="focus:border-teal-400', w-full rounded-lg border border-solid border-gray-300 px-4 py-2 transition-all outline-none placeholder:text-gray-300"
        />
        <button
          type="submit"
          className="mt-5 rounded bg-teal-600 px-4 py-2 text-white"
        >
          Create post
        </button>
      </form>
    </main>
  );
};

export default CreatePost;
