import { _mock } from 'src/_mock';

// TO GET THE USER FROM THE AUTHCONTEXT, YOU CAN USE

// CHANGE:
// import { useMockedUser } from 'src/hooks/use-mocked-user';
// const { user } = useMockedUser();

// TO:
// import { useAuthContext } from 'src/auth/hooks';
// const { user } = useAuthContext();

// ----------------------------------------------------------------------

export function useMockedUser() {
  const user = {
    id: '8864c717-587d-472a-929a-8e5f298024da-0',
    displayName: 'Admin',
    email: 'admin@gmail.com',
    password: 'Admin@123',
    photoURL: _mock.image.avatar(24),
    phoneNumber: '+91 6767898765',
    country: 'India',
    address: 'Nashik',
    state: 'Maharashtra',
    city: 'Nashik',
    zipCode: '422001',
    about: 'extraction.',
    role: 'admin',
    isPublic: true,
  };

  return { user };
}
