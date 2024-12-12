import { AtomLoader } from 'react-loaders-kit';

export const Loader = (loading) => {
    const loaderProps = {
        loading,
        size: 155,
        duration: 1,
        colors: ['#2a9d8f', '#177e89'],
    }

  return (
    <>
      <AtomLoader {...loaderProps} />
    </>
  );
};