import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Layout from './Layout'
import { Introduction } from './pages'

const App: React.FC = () => {
  return (
    <BrowserRouter>
    <Layout>
      <Routes>
         {/* Introduction */}
           <Route path="/" element={<Introduction />} />
          <Route path="/introduction" element={<Introduction />} />
          
          {/* Types */}
          {/* <Route path="/types/common" element={<TypesCommon />} />
          <Route path="/types/errors" element={<TypesErrors />} />
          <Route path="/types/logger" element={<TypesLogger />} />
          <Route path="/types/responses" element={<TypesResponses />} />
           */}

          {/* Constants */}
          {/* <Route path="/constants/error-code" element={<ErrorCode />} />
          <Route path="/constants/http-status" element={<HttpStatus />} />
          <Route path="/constants/messages" element={<Messages />} />
           */}
          {/* ADI */}
          {/* <Route path="/adi/config" element={<Config />} />
          <Route path="/adi/utils" element={<Utils />} /> */}
          
          {/* Certus */}
          {/* <Route path="/certus/errors" element={<CertusErrors />} />
          <Route path="/certus/guards" element={<CertusGuards />} />
          <Route path="/certus/utils" element={<CertusUtils />} /> */}
          
          {/* Responses */}
          {/* <Route path="/responses/builder" element={<Builder />} />
          <Route path="/responses/formatter" element={<Formatter />} />
          <Route path="/responses/guards" element={<ResponsesGuards />} /> */}
          
          {/* Valt */}
          {/* <Route path="/valt/logger/formats/json" element={<JsonFormat />} />
          <Route path="/valt/logger/formats/pretty" element={<PrettyFormat />} />
          <Route path="/valt/logger/valt-logger" element={<ValtLogger />} />
          <Route path="/valt/middleware" element={<Middleware />} />
          <Route path="/valt/security" element={<Security />} /> */}
      </Routes>
    </Layout>
    </BrowserRouter>
  )
}

export default App