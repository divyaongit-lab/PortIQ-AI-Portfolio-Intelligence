import { createBrowserRouter } from 'react-router-dom'
import { AppLayout }   from '@/components/layout/AppLayout'
import Dashboard       from '@/pages/Dashboard'
import Portfolio       from '@/pages/Portfolio'
import Clients         from '@/pages/Clients'
import ClientDetail    from '@/pages/ClientDetail'
import Projects        from '@/pages/Projects'
import Reports         from '@/pages/Reports'
import Copilot         from '@/pages/Copilot'
import Settings        from '@/pages/Settings'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true,               element: <Dashboard />    },
      { path: 'portfolio',         element: <Portfolio />    },
      { path: 'clients',           element: <Clients />      },
      { path: 'clients/:clientId', element: <ClientDetail /> },
      { path: 'projects',          element: <Projects />     },
      { path: 'reports',           element: <Reports />      },
      { path: 'copilot',           element: <Copilot />      },
      { path: 'settings',          element: <Settings />     },
    ],
  },
])
