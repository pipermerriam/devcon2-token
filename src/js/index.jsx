import ReactDOM from 'react-dom'
import React from 'react'
import Root from './components/Root'

import '../css/bootstrap.scss'
import 'font-awesome/css/font-awesome.css'

// syntax highlighting
import { registerLanguage } from "react-syntax-highlighter/dist/light"
import js from 'highlight.js/lib/languages/javascript';
registerLanguage('javascript', js);

module.exports = Root
