import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
  'App.tsx': `
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Navigation } from './navigation';

function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Riro's Customized Template</Text>
      <Text style={styles.subtitle}>Hello from your React Native Template 👋</Text>
      <Navigation />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding:30
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center', 
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    marginBottom: 40,
    textAlign: 'center', 
  },
});
export default App;  
`,

  'navigation/index.tsx': `

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';

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
export { Navigation };  
`,

  'screens/HomeScreen.tsx': `

import React from 'react';
import { View, Text, Button } from 'react-native';

function HomeScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Welcome to the Home Screen 👋</Text>
    </View>
  );
}
export default HomeScreen;  
`,
'models/RequestClass.ts': `
export abstract class Request<T> {
  constructor(protected endpoint: string, protected data?: unknown) {}

  abstract send(): Promise<T>;

  protected async handleRequest(fetchFunction: () => Promise<T>): Promise<T> {
    try {
      return await fetchFunction();
    } catch (error) {
      console.error(\`Error in request to \${this.endpoint}:\`, error);
      throw error;
    }
  }
}
`,
'models/GetRequest.ts': `

import  api  from "../services/api";
import { Request } from "./RequestClass";

class GetRequest<T> extends Request<T> {
  async send(): Promise<T> {
    return this.handleRequest(async () => {
      const response = await api.get<T>(this.endpoint);
      return response.data;
    });
  }
}
export { GetRequest };
`,
  'models/PostRequest.ts': `

import  api  from "../services/api";
import { Request } from "./RequestClass";

class PostRequest<T> extends Request<T> {
  async send(): Promise<T> {
    return this.handleRequest(async () => {
      const response = await api.post<T>(this.endpoint, this.data);
      return response.data;
    });
  }
}
export { PostRequest };
`,
  'hooks/useRequest.tsx': `

import { useCallback, useState } from 'react';
import { Request } from "./RequestClass";

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

export { useRequest };
`,
  'services/api.ts': `

import axios from 'axios';
import Config from 'react-native-config';

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
  baseURL:baseURL!,
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