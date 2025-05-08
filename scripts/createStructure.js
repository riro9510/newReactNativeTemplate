const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const folderStructure = [
  'assets',
  'components',
  'constants',
  'hooks',
  'models',
  'navigation',
  'screens',
  'services',
  'theme',
  'types',
];

const fileContents = {
  'App.tsx': `// @ts-nocheck
  const React = require('react');
const { View, Text } = require('react-native');
const { Navigation } = require('./navigation');

function App() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Hello from your React Native Template 👋</Text>
      <Navigation />
    </View>
  );
}
module.exports = App;  
`,

  'navigation/index.tsx': `
  // @ts-nocheck
  const React = require('react');
const { NavigationContainer } = require('@react-navigation/native');
const { createStackNavigator } = require('@react-navigation/stack');
const HomeScreen = require('../screens/HomeScreen');

const Stack = createStackNavigator();

function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
module.exports = { Navigation };  
`,

  'screens/HomeScreen.tsx': `
  // @ts-nocheck
  const React = require('react');
const { View, Text, Button } = require('react-native');

function HomeScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Welcome to the Home Screen 👋</Text>
    </View>
  );
}
module.exports = HomeScreen;  
`,

  'services/api.ts': `
  // @ts-nocheck
  const axios = require('axios');

const baseURL = process.env.ENVIRONMENT === 'production' ? process.env.API_URL_PROD : process.env.API_URL_DEV ?? 'http://localhost:3000/api';
const token = process.env.API_TOKEN;

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
    Authorization: token ? 'Bearer ' + token : '',
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);
module.exports = { api };
`,
  'models/PostRequest.ts': `
// @ts-nocheck
const { api } = require("../services/api");
const { Request } = require("./RequestClass");

class PostRequest<T> extends Request<T> {
  async send(): Promise<T> {
    return this.handleRequest(async () => {
      const response = await api.post<T>(this.endpoint, this.data);
      return response.data;
    });
  }
}
  module.exports = { PostRequest };
`,
  'hooks/useRequest.tsx': `
// @ts-nocheck
const { useCallback, useState } = require('react');
const { Request } = require("./RequestClass");

function useRequest(request) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const send = useCallback(async () => {
    setLoading(true);
    try {
      const result = await request.send();
      return result;
    } catch (err) {
      setError({
        message: err.response?.data?.message || err.message,
        code: err.response?.status || 500
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, [request]);

  return { send, loading, error };
}

module.exports = { useRequest };
`,
  'services/api.ts': `
// @ts-nocheck
const axios = require('axios');
const Config = require('react-native-config');

const {
  API_URL_PROD, 
  API_URL_DEV, 
  API_TOKEN, 
  USE_COOKIES,
  NODE_ENV
} = Config;

const isDev = NODE_ENV === 'development';
const baseURL = isDev ? API_URL_DEV : API_URL_PROD;

interface ApiConfig {
  baseURL: string;
  timeout: number;
  headers: Record<string, string>;
  withCredentials?: boolean;
}

const apiConfig: ApiConfig = {
  baseURL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Cache-Control': 'no-cache',
  },
};

if (USE_COOKIES === 'true') {
  apiConfig.withCredentials = true;
} else if (API_TOKEN) {
  apiConfig.headers.Authorization = \`Bearer \${API_TOKEN}\`;
}

const api = axios.create(apiConfig);


api.interceptors.request.use(
  (config) => {
    if (isDev) {
      console.log('Request:', config.method?.toUpperCase(), config.url);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => {
    if (isDev) {
      console.log('Response:', response.status, response.config.url);
    }
    return response.data;
  },
  (error) => {
    if (isDev) {
      console.error('API Error:', {
        url: error.config?.url,
        status: error.response?.status,
        data: error.response?.data,
      });
    }
    
    const apiError = {
      message: error.response?.data?.message || error.message,
      code: error.response?.status || 500,
      data: error.response?.data,
    };
    
    return Promise.reject(apiError);
  }
);

export default api;
`,
};

function createFolders(basePath, folders) {
  folders.forEach((relativePath) => {
    const dirPath = path.resolve(__dirname, '..', relativePath);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
      console.log(`📁 Folder created: ${dirPath}`);
    }
  });
}

function createExampleComponents(content) {
  Object.entries(content).forEach(([relativeFilePath, fileContent]) => {
    const absoluteFilePath = path.resolve(__dirname, '..', relativeFilePath);
    const dirPath = path.dirname(absoluteFilePath);

    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
      console.log(`📁 Folder created: ${dirPath}`);
    }

    fs.writeFileSync(absoluteFilePath, fileContent);
    console.log(`📄 File created: ${absoluteFilePath}`);
  });
}

createFolders('.', folderStructure);
createExampleComponents(fileContents);
