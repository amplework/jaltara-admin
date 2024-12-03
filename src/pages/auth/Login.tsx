import { Link as RouterLink } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
import { Box, Card, Stack, Link, Container, Typography } from '@mui/material';
// routes
import { PATH_AUTH } from '../../routes/paths';
// hooks
import useAuth from '../../hooks/useAuth';
import useResponsive from '../../hooks/useResponsive';
// components
import Page from '../../components/Page';
import Image from '../../components/Image';
// sections
import { LoginForm } from '../../sections/auth/login';
import appIcon from '../../assets/images/logo.svg';
import backgroundImg1 from "../../assets/images/background.png"

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
  },
  backgroundImage:`url(${backgroundImg1})`,
  backgroundRepeat:"no-repeat",
  objectFit:"contain",
  backgroundSize:"cover"
}));

const HeaderStyle = styled('header')(({ theme }) => ({
  top: 0,
  zIndex: 9,
  lineHeight: 0,
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  position: 'absolute',
  padding: theme.spacing(3),
  justifyContent: 'space-between',
  [theme.breakpoints.up('md')]: {
    alignItems: 'flex-start',
    padding: theme.spacing(7, 5, 0, 7),
  },
}));

const SectionStyle = styled(Card)(({ theme }) => ({
  width: '100%',
  maxWidth: 464,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  margin: theme.spacing(2, 0, 2, 2),
}));

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 480,
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(12, 0),
}));

// ----------------------------------------------------------------------

export default function Login() {
  const { method } = useAuth();

  const smUp = useResponsive('up', 'sm');

  const mdUp = useResponsive('up', 'md');

  return (
    <Page title="Login">
      <RootStyle>
        {/* <HeaderStyle>
          <Logo />
          {smUp && (
            <Typography variant="body2" sx={{ mt: { md: -2 } }}>
              Don’t have an account? {''}
              <Link variant="subtitle2" component={RouterLink} to={PATH_AUTH.register}>
                Get started
              </Link>
            </Typography>
          )}
        </HeaderStyle> */}

        {mdUp && (
          <SectionStyle sx={{ alignItems: 'center' }}>
            <Typography
              variant="h3"
              sx={{ px: 5, fontWeight: '300', letterSpacing: 2,  }}
            >
              Welcome to
            </Typography>
            <Box display={'flex'}>
              <Typography variant="h2" sx={{ mb: 5, letterSpacing: 3, color: '#3892FA' }}>
                JAL
              </Typography>
              <Typography variant="h2" sx={{ letterSpacing: 3, mb: 5 }}>
                TARA
              </Typography>
            </Box>
            <Image
              visibleByDefault
              disabledEffect
              src={appIcon}
              alt="login"
              sx={{ height: 225, width: 150 }}
            />
          </SectionStyle>
        )}

        <Container maxWidth="md">
          <ContentStyle>
            <Stack direction="row" sx={{ mb: 5 }}>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h4" gutterBottom>
                  Sign in to Jaltara
                </Typography>
                <Typography sx={{ color: 'text.secondary' }}>Enter your details below.</Typography>
              </Box>
            </Stack>

            <LoginForm />

            {!smUp && (
              <Typography variant="body2" align="center" sx={{ mt: 3 }}>
                Don’t have an account?{' '}
                <Link variant="subtitle2" component={RouterLink} to={PATH_AUTH.register}>
                  Get started
                </Link>
              </Typography>
            )}
          </ContentStyle>
        </Container>
      </RootStyle>
    </Page>
  );
}
