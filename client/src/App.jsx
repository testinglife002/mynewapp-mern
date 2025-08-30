import React, { useEffect, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Register from './pages/auth/Register'
import Login from './pages/auth/Login'
import Home from './pages/home/Home'
import DashboardPage from './pages/dashboard/DashboardPage'
import DashboardCategories from './components/category/DashboardCategories'
import Dashboard from './pages/dashboard/Dashboard'
import DashboardIndex from './pages/dashboard/DashboardIndex'
import CategoryManager from './components/category/CategoryManager'
import CategoryTreeViewAlt from './components/category/CategoryTreeViewAlt'
import AllCategory from './components/category/AllCategory'
import AddCategory from './components/category/AddCategory'
import EditCategory from './components/category/EditCategory'
import TaskLayout from './apps/taskmanager/layout/TaskLayout'
import DashboardUser from './pages/dashboard/DashboardUser'
import TodoApp from './apps/todoapp/TodoApp'
import Todoboard from './apps/todoapp/Todoboard'

import DashboardUserAlt from './pages/dashboard/DashboardUserAlt'
import TaskPage from './apps/taskmanager/TaskPage'
import TaskDashboard from './apps/taskmanager/TaskDashboard'
import Tasks from './apps/taskmanager/Tasks'
import TrelloDashboardPage from './apps/trello/TrelloDashboardPage'
import BoardDetailsPage from './apps/trello/BoardDetailsPage'
import MainLayout from './apps/taskmanager/layout/MainLayout'
import MainLayoutTodo from './apps/todoapp/layout/MainLayoutTodo'
import LayoutTodo from './apps/todoapp/layout/LayoutTodo'
import TodoMainLayout from './apps/todoapp/layout/TodoMainLayout'
import TodoLayout from './apps/todoapp/layout/TodoLayout'
import TodoDashboardLayout from './apps/todoapp/appcomponents/TodoDashboardLayout'
import CreateTodo from './apps/todoapp/appcomponents/CreateTodo'
import DisplayTodos from './apps/todoapp/appcomponents/DisplayTodos'
import DisplayAllTodos from './apps/todoapp/appcomponents/DisplayAllTodos'
import TodosMainLayout from './apps/todoapp/appcomponents/TodosMainLayout'
import MainLayoutTodos from './apps/todoapp/todos/MainLayoutTodos'
import KanbanView from './apps/todoapp/appcomponents/TodoViews/KanbanView'
import BoardList from './apps/trello/BoardList'
import BoardDetails from './apps/trello/BoardDetails'
import BoardDetailsPageAlt from './apps/trello/BoardDetailsPageAlt'
import TaskDetails from './apps/taskmanager/TaskDetails'
import { Toaster } from 'react-hot-toast';
import { requestNotificationPermission } from './utils/requestNotificationPermission'
import DesignPage from './pages/DesignPage'
import Notifications from './components/Notifications'
import NotesApp from './apps/notesapp/NotesApp'
import NoteView from './apps/notesapp/appcomponents/NoteView'
import ViewNote from './apps/notesapp/appcomponents/ViewNote'
import EditorContextProvider from './apps/notesapp/appcomponents/EditorContext'
import AllBlogPosts from './pages/post/AllBlogPosts'
import AddBlogPost from './pages/post/AddBlogPost'
import PostDetails from './pages/post/PostDetails'
import DesignPageAlt from './pages/DesignPageAlt'
import DesignPageWrapper from './pages/DesignPageWrapper'
import DashboardDesign from './pages/DashboardDesign'
import LayoutMain from './pages/dashboard/LayoutMain'
import SuperApp from './pages/SuperApp'
import CustomSuperApp from './pages/CustomSuperApp'
import SuperAppLayout from './pages/SuperAppLayout'
import DashboardCanva from './apps/canva/DashboardCanva'
import Editor from './apps/canva/Editor'
import NoteDetails from './apps/notesapp/appcomponents/NoteDetails'
import GeekfolioHome from './pages/GeekfolioHome'



const App = () => {

  // const [user, setUser] = useState(null)

  const [active, setActive] = useState("home");
  const [user, setUser] = useState(null);

  const [role, setRole] = useState("guest");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  // App.jsx or MainLayout.jsx
  /*
  useEffect(() => {
    // Only ask if user is logged in and permission not yet granted
    if (Notification.permission === "default" && user) {
      Notification.requestPermission().then((permission) => {
        console.log("Notification permission:", permission);
      });
    }
  }, [user]); // or on mount if already authenticated

  useEffect(() => {
    if ("Notification" in window && Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);
  */  
  useEffect(() => {
    requestNotificationPermission();
  }, []);



  return (
    <>
    <Toaster position="top-right" />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
     <Route path="/login" element={<Login setUser={setUser} />} />

      <Route path="/user" element={<DashboardUser user={user} />} />
      <Route path="/user-alt" element={<DashboardUserAlt  />} />

      {/*<Route path="/todosapp" element={<TodoApp user={user} />} />
      <Route path="/todos" element={<Todoboard user={user} />} />
      <Route path="/todos-layout" element={<MainLayoutTodo />} />
      <Route path="/todos-lay" element={<LayoutTodo />} />*/}
      <Route path="/todoslayout" element={<TodoLayout />} />
      <Route path="/add-todos" element={<CreateTodo user={user} />} />
      <Route path="/all-todos" element={<DisplayTodos />} />
      <Route path="/alltodos" element={<DisplayAllTodos />} />
      {/*<Route path="/todos-dashboard" element={<TodoDashboardLayout />} />
      <Route path="/project/todos" element={<TodosMainLayout />} />*/}
      <Route path="/todos-main" element={<MainLayoutTodos />} />
      <Route path="/todos-kanban" element={<KanbanView />} />
      

      <Route path="/task-manager" element={<TaskLayout user={user} />} />
      <Route path="/task-main" element={<MainLayout user={user} />} />  
      <Route path="/taskpage" element={<TaskPage />} />
      <Route path="/taskboard" element={<TaskDashboard />} />
      <Route path='/tasks' element={<Tasks />} />
      <Route path='/task/:id' element={<TaskDetails />} />
      {/*<Route path='/completed/:status' element={<Tasks />} />
      <Route path='/in-progress/:status' element={<Tasks />} />
      <Route path='/todo/:status' element={<Tasks />} />
      <Route path='/team' element={<Users />} />
      <Route path='/trashed' element={<Trash />} />
      <Route path='/task/:id' element={<TaskDetails />} />*/}

     {/* <Route path="/trello-board" element={<TrelloDashboardPage />} />
      <Route path="/board/:boardId" element={<BoardDetailsPage />} /> */}
    <Route path="/trello-board" element={<TrelloDashboardPage user={user} />} />
    {/*<Route path="/boards" element={<BoardList user={user} />} />*/}
    {/*<Route path="/board/:boardId" element={<BoardDetails />} /> {/* NEW */}
    {/*<Route path="/board/:boardId" element={<BoardDetailsPage />} />*/}
    <Route path="/board/:boardId" element={<BoardDetailsPageAlt />} /> 

    <Route path="/notes" element={<NotesApp user={user} />} />
    {/*<Route path="/notes/:id" element={<NoteView />} />
    <Route path="/view-notes/:id" element={<ViewNote user={user} />} />*/}
    <Route path="/notes/:id" element={<NoteDetails />} />

    <Route path="/posts" element={
        <EditorContextProvider>
          <AllBlogPosts user={user} />
        </EditorContextProvider>
      } 
    />
    <Route path="/posts/:id" element={
          <EditorContextProvider>  
            <PostDetails />
          </EditorContextProvider>
        } 
      />
    <Route path="/add-post" element={
        <EditorContextProvider>
          <AddBlogPost user={user} />
        </EditorContextProvider>
      } 
    />

    <Route path="/canva" element={<DesignPage user={user} />} />
    <Route path="/designs" element={<DashboardDesign user={user}  />} />
    <Route path="/design/:designId" element={<DesignPageWrapper user={user} />} />
    <Route path="/canvas" element={<DesignPageAlt />} />

    <Route path="/notifications" element={<Notifications />} />

    <Route path="/superapps" element={<SuperApp />} />
    <Route path="/custom-superapps" element={<CustomSuperApp />} />
    <Route path="/layout-superapps" element={<SuperAppLayout />} />
    <Route path="/geekfolio-home" element={<GeekfolioHome />} />

    <Route path="/canva-dashboard" element={<DashboardCanva />} />
      <Route path="/editor/:designId" element={<Editor />} />

    <Route path='main' 
      element={<LayoutMain
        setActive={setActive}
        active={active}
        user={user} 
      />} 
    ></Route>

      <Route path="/dashboard" element={<Dashboard />}>
          <Route index element={<DashboardIndex />} />
          <Route path="categories" element={<DashboardCategories />} />
          <Route path="category-manager" element={<CategoryManager />} />
          <Route path="categories-alt" element={<CategoryTreeViewAlt />} />
          <Route path="all-category" element={<AllCategory />} />
          <Route path="add-category" element={<AddCategory />} />
          <Route path="edit-category/:slug" element={<EditCategory />} />
          {/*<Route path="categories" element={<AllCategory />} />
          <Route path="categories/add" element={<AddCategory />} />
          <Route path="categories/edit/:slug" element={<EditCategory />} />*/}
          {/* Add more child routes here */}
      </Route>

      {/*<Route path="/dashboard" element={<DashboardPage />} exact />
      <Route path="/dashboard/categories" element={<DashboardCategories />} exact />
      <Route path="/dashboard/all-category" element={<DashboardPage />} exact />
      <Route path="/dashboard/add-category" element={<DashboardPage />} exact />*/}

    </Routes>
    </>
  )
}

export default App
