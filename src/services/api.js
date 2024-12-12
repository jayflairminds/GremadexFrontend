import axios from 'axios';
// const ApiURL = 'http://127.0.0.1:8000/api'

// const ApiURL = 'http://18.204.109.230:8000/api'
// Jay
// const ApiURL = "https://vh2355rk-8000.inc1.devtunnels.ms/api"
// Shivani
// const ApiURL = "https://0zm8xcdb-8000.inc1.devtunnels.ms/api"

//Buid
// const ApiURL = `${window.location}/api`

//Deploy 

//  const ApiURL = "https://glasdex.com/api"
const ApiURL = "https://restatx.azurewebsites.net/api"
//Pratik
// const ApiURL = "https://td3zdc62-8000.inc1.devtunnels.ms/api"
// 
export const loginPost =(email,password)=>{
    const res =  axios.post(`${ApiURL}/login/`,{
        username:email,
        password:password
    },{withCredentials:true})
    return res
} 
  


export const postLogout =()=>{
    const tokenId = localStorage.getItem('tokennn');
    const res =  axios.post(`${ApiURL}/logout/`,{
        headers: {
            'Authorization': `Token ${tokenId}`

        },
    },{withCredentials:true})
    return res
} 

export const getNotification =(page) =>{
    const tokenId = localStorage.getItem('tokennn');
    return axios.get(`${ApiURL}/notification/`, {
        params: { page: page},
        headers: {
            'Authorization': `Token ${tokenId}`

        },
        withCredentials: true
    });
}

export const getAssestList = () =>{
    const tokenId = localStorage.getItem('tokennn');
    console.log(tokenId,"apiassesr");
    const res = axios.get (`${ApiURL}/asset-list/`,{
        headers: {
            'Authorization': `Token ${tokenId}` 
        },
    },{withCredentials:true})
    return res
} 

export const getContingencyStatus = (graphName,loanId) =>{
    
    const tokenId = localStorage.getItem('tokennn'); 
    return axios.get(`${ApiURL}/dashboard-graph/`, {
        params: { loan_id: loanId,
            graph_name:graphName
         },
        headers: {
            'Authorization': `Token ${tokenId}`

        },
        withCredentials: true
    });
}

export const deleteBudgetMarter =(id)=>{

    const tokenId = localStorage.getItem('tokennn');
    console.log(tokenId, "APITOKENID");

    return axios.delete(
        `${ApiURL}/budget-master/${id}`,
        {
            headers: {
                'Authorization': `Token ${tokenId}`,
            },
        }
    );
}

export const addRowPost=(payload)=>{
    const tokenId = localStorage.getItem('tokennn');
    return axios.post(`${ApiURL}/budget-master/`, payload
        , {
          headers: {
            'Authorization': `Token ${tokenId}`
          },
          withCredentials: true
        });
}

export const budgetMaster = (loanId, usesType) => {
    const tokenId = localStorage.getItem('tokennn'); 
    return axios.get(`${ApiURL}/budget-master/`, {
        params: { 
            loan_id: loanId,
            uses_type: usesType
        },
        headers: {
            'Authorization': `Token ${tokenId}`
        },
        withCredentials: true
    });
}

export const save_budgetMaster = (id, data) => {
    const tokenId = localStorage.getItem('tokennn'); 
  
    return axios.put(`${ApiURL}/budget-master/${id}/`, data,
        {
            headers: {
                'Authorization': `Token ${tokenId}`
    
            }
        }
   
);
  };

  export const usesType =(loanId)=>{
    const tokenId = localStorage.getItem('tokennn');
    return axios.get(`${ApiURL}/list-uses-type/`, {
        params: { loan_id: loanId},
        headers: {
            'Authorization': `Token ${tokenId}`

        },
        withCredentials: true
    });
}

export const getHistoryDrawTracking =(loanId) =>{
    const tokenId = localStorage.getItem('tokennn');
    return axios.get(`${ApiURL}/list-draw-tracking/`, {
        params: { loan_id: loanId},
        headers: {
            'Authorization': `Token ${tokenId}`

        },
        withCredentials: true
    });
}

export const statusDraw =(application_status) =>{
    const tokenId = localStorage.getItem('tokennn');
    return axios.get(`${ApiURL}/status-mapping/`, {
        params: { application_status: application_status},
        headers: {
            'Authorization': `Token ${tokenId}`

        },
        withCredentials: true
    });
} 

export const putDrawApproval =(id,selectedStatus) =>{
    const tokenId = localStorage.getItem('tokennn');
    return axios.put(`${ApiURL}/draw-approval/`, {
        draw_tracking_id:id,
        status_action:selectedStatus
    },
        {
            headers: {
                'Authorization': `Token ${tokenId}`
    
            }
        }
   
);
}


export const postDrawapproval=(loan_id,drawRequests)=>{
    const tokenId = localStorage.getItem('tokennn');
    return axios.post(`${ApiURL}/draw-approval/`, {
        loan_id:loan_id,
        draw_request:drawRequests[0]?.draw_request
    },
        {
            headers: {
                'Authorization': `Token ${tokenId}`
    
            }
        }
    )
}



export const putDrawRequest=(logData)=>{
    const tokenId = localStorage.getItem('tokennn');
    return axios.put(`${ApiURL}/draw-request/`, logData,
        {
            headers: {
                'Authorization': `Token ${tokenId}`
    
            }
        }
   
);
}

export const postCreateProject=(loanId) =>{
    const tokenId = localStorage.getItem('tokennn');
    return axios.post(`${ApiURL}/draw-request/`,{
        loan_id :loanId
    }
        , {
          headers: {
            'Authorization': `Token ${tokenId}`
          },
          withCredentials: true
        });
}

export const getDrawRequestBorrower= (loanId,drawRequest) =>{
    const tokenId = localStorage.getItem('tokennn');
    return axios.get(`${ApiURL}/draw-request/`, {
        params: { loan_id: loanId,
            draw_request : drawRequest
        },
        headers: {
            'Authorization': `Token ${tokenId}`

        },
        withCredentials: true
    });
}

export const deleteDocManagement = (docId) => {
    console.log(docId, "api");

    const tokenId = localStorage.getItem('tokennn');
    console.log(tokenId, "APITOKENID");

    return axios.delete(
        `${ApiURL}/delete-document/${docId}`,
        {
            headers: {
                'Authorization': `Token ${tokenId}`,
            },
           
        }
    );
};

export const docTypeLoad =(loanId)=>{
    console.log(loanId,"IDAPIAPI");
    
    const tokenId = localStorage.getItem('tokennn');
    return axios.get(`${ApiURL}/documenttypes-loan/`, {
        params: { loan_id: loanId},
        headers: {
            'Authorization': `Token ${tokenId}`

        },
        withCredentials: true
    });
}

export const getListOfDoc = (loanId,value) =>{
    console.log(value,"valueeeeee");
    
    const tokenId = localStorage.getItem('tokennn');
    return axios.get(`${ApiURL}/list-of-documents/`, {
        params: { loan_id: loanId,
            document_type_id:value
        },
        headers: {
            'Authorization': `Token ${tokenId}`

        },
        withCredentials: true
    });
}

export const getViewFile = (fileId) => {
    const tokenId = localStorage.getItem('tokennn');
    return axios.get(`${ApiURL}/document-management/`, {
        params: { file_id: fileId },
        headers: {
            'Authorization': `Token ${tokenId}`,
            // responseType: 'arraybuffer',
        },
        withCredentials: true
    });
};

export const postDocManagement = (formData) => { // Expect only formData
    const tokenId = localStorage.getItem('tokennn');
  
    return axios.post(`${ApiURL}/document-management/`, formData, {
      headers: {
        'Authorization': `Token ${tokenId}`
      },
      withCredentials: true
    });
  };

  export const SummaryDoc = (fileId) => {
    const tokenId = localStorage.getItem('tokennn');
    return axios.get(`${ApiURL}/retrieve-summary/`, {
        params: { id: fileId },
        headers: {
            'Authorization': `Token ${tokenId}`
        },
        withCredentials: true
    });
}

export const applicationStatus =(applicationStatus) =>{
    const tokenId = localStorage.getItem('tokennn');
    return axios.get(`${ApiURL}/status-mapping/`, {
        params: { application_status: applicationStatus},
        headers: {
            'Authorization': `Token ${tokenId}`

        },
        withCredentials: true
    });
}

export const updateStatus = (statusUpdate) =>{
    const tokenId = localStorage.getItem('tokennn');
    return axios.post(`${ApiURL}/document-update-status/`, statusUpdate
    
        , {
          headers: {
            'Authorization': `Token ${tokenId}`
          },
          withCredentials: true
        });
}


export const budget_summary = (loanId)=>{
    const tokenId = localStorage.getItem('tokennn'); 
    return axios.get(`${ApiURL}/budget-summary/`, {
        params: { loan_id: loanId },
        headers: {
            'Authorization': `Token ${tokenId}`

        },
        withCredentials: true
    });
}


export const listOFDocLoan =(loanId) =>{
    const tokenId = localStorage.getItem('tokennn');
    return axios.get(`${ApiURL}/list-of-documents/`, {
        params: { loan_id: loanId},
        headers: {
            'Authorization': `Token ${tokenId}`

        },
        withCredentials: true
    });

}

export const postFileUpload = (selectedFile) => {
    const formData = new FormData();
    formData.append('uploaded_file', selectedFile);
  
    return axios.post(`${ApiURL}/upload/`, formData);
};

export const postPromt =(promptInput)=>{
    return axios.post ( `${ApiURL}/response/`,{
        "predefined_question":null,
        "user_question":promptInput
    })
}


export const postSummary =() =>{
    return axios.post ( `${ApiURL}/response/`,{
        "predefined_question":"summary",
        "user_question":null
    })
}

export const getProjectList =()=>{
    const tokenId = localStorage.getItem('tokennn');
    return axios.get(`${ApiURL}/project-list/`, {
        headers: {
            'Authorization': `Token ${tokenId}`

        },
        withCredentials: true
    });
}

export const deleteProject = (projectId) => {
    console.log(projectId, "api");

    const tokenId = localStorage.getItem('tokennn');
    console.log(tokenId, "APITOKENID");

    return axios.delete(
        `${ApiURL}/project/${projectId}`,
        {
            headers: {
                'Authorization': `Token ${tokenId}`,
            },
        }
    );
};

export const postProjectForm = (formData) => {
    const tokenId = localStorage.getItem('tokennn');
    return axios.post(`${ApiURL}/project/`, formData
       , {
      headers: {
        'Authorization': `Token ${tokenId}`
      },
      withCredentials: true
    });
  };

  export const updateProject = (id, fromData)=>{
    console.log(id,"apiID");
    
    const tokenId = localStorage.getItem('tokennn');
    return axios.put(`${ApiURL}/project/${id}`, fromData,
        {
            headers: {
                'Authorization': `Token ${tokenId}`
    
            }
        }
   
);
}

export const insertUsers=(formattedData)=>{
    const tokenId = localStorage.getItem('tokennn');
    return axios.post(`${ApiURL}/insert-uses/`, formattedData
      , {
        headers: {
          'Authorization': `Token ${tokenId}`
        },
        withCredentials: true
      });
}

export const uploadBudget = (fileUpload, loadId) => {
    const tokenId = localStorage.getItem('tokennn');
    
    const formData = new FormData();
    
    formData.append('file', fileUpload); 
    formData.append('loan_id', loadId);  
  
    // Make the POST request with Axios
    return axios.post(`${ApiURL}/upload-budget/`, formData, {
      headers: {
        'Authorization': `Token ${tokenId}`,
      },
      withCredentials: true
    });
  };
  


export const getInspectorRoleType = ()=>{
    const tokenId = localStorage.getItem('tokennn');
    return axios.get(`${ApiURL}/list-users/`, {
        params: { role_type: "inspector"},
        headers: {
            'Authorization': `Token ${tokenId}`

        },
        withCredentials: true
    });
}

export const getLenderRoleType = ()=>{
    const tokenId = localStorage.getItem('tokennn');
    return axios.get(`${ApiURL}/list-users/`, {
        params: { role_type: "lender"},
        headers: {
            'Authorization': `Token ${tokenId}`

        },
        withCredentials: true
    });
}

export const getcheckList =(loanId)=>{
    console.log(loanId,"LoandID");
  
    const tokenId = localStorage.getItem('tokennn');
    return axios.get(`${ApiURL}/uses-list/`, {
        params: { loan_id: loanId},
        headers: {
            'Authorization': `Token ${tokenId}`

        },
        withCredentials: true
    });
}

export const postLoan =(payload) =>{
    const tokenId = localStorage.getItem('tokennn');
    return axios.post(`${ApiURL}/loan/`, payload
      , {
        headers: {
          'Authorization': `Token ${tokenId}`
        },
        withCredentials: true
      });
}

export const postSubmitSummary =(loanId) =>{
    const tokenId = localStorage.getItem('tokennn');
    return axios.post(`${ApiURL}/submit-budget/`, {
        loan_id:loanId,
    },
        {
            headers: {
                'Authorization': `Token ${tokenId}`
    
            }
        }
    )
}

export const putLoanApproval =(status, loanId) =>{
    const tokenId = localStorage.getItem('tokennn');
    return axios.put(`${ApiURL}/loan-approval/`, {
        status_action:status,
        loan_id:loanId
    },
        {
            headers: {
                'Authorization': `Token ${tokenId}`
    
            }
        }
   
);
}

export const postNotification =(selectedId) =>{
    console.log(selectedId,"sssssss");
    
    const tokenId = localStorage.getItem('tokennn');
    return axios.post(`${ApiURL}/notification/`, {
        notification_id:selectedId,
    },
        {
            headers: {
                'Authorization': `Token ${tokenId}`
    
            }
        }
    )
}

export const userAddByAdmin = (formData) => {
    // const tokenId = localStorage.getItem('tokennn');
    
    // Create a FormData object and append each field
    const form = new FormData();
    form.append('username', formData.username);
    form.append('password', formData.password);
    form.append('email', formData.email);
    form.append('role_type', formData.role_type);
    form.append('first_name', formData.first_name);
    form.append('last_name', formData.last_name);
  
    // Post request using axios with FormData
    return axios.post(`${ApiURL}/register/`, form);
  } 

export const getListOfUser =() =>{
    const tokenId = localStorage.getItem('tokennn');
    return axios.get(`${ApiURL}/list-users/`, {
        // params: { role_type: "admin"},
        headers: {
            'Authorization': `Token ${tokenId}`

        },
        withCredentials: true
    });
}


export const deleteUser =(id)=>{
    const tokenId = localStorage.getItem('tokennn');
    return axios.delete(
        `${ApiURL}/delete-user/${id}`,
        {
            headers: {
                'Authorization': `Token ${tokenId}`,
            },
        }
    );
}


export const passWordReset = (username) => {
    return axios.post(`${ApiURL}/password-reset/`, 
        { username: username }, // Send the email in the body of the POST request
        {
            withCredentials: true // If your API requires credentials like cookies
        }
    );
};

export const resetPasswordAPI =(newPassword,token) =>{
    console.log(newPassword,"newPassword");
    
    // const tokenId = localStorage.getItem('tokennn');
    return axios.post(`${ApiURL}/password-confirm/${token}`, {
        new_password:newPassword,
        confirm_password:newPassword
    },
        // {
        //     headers: {
        //         'Authorization': `Token ${tokenId}`
    
        //     }
        // }
    )
}

export const getPaymentOptions =() =>{
    const tokenId = localStorage.getItem('tokennn');
    return axios.get(`${ApiURL}/product-list/`, {
        // params: { role_type: "admin"},
        headers: {
            'Authorization': `Token ${tokenId}`

        },
        withCredentials: true
    });
}



export const postCheckOutSession =(priceId,inputValue) =>{
    
    const tokenId = localStorage.getItem('tokennn');
    return axios.post(`${ApiURL}/create-checkout-session/`, {
        price_id:priceId,
        promo_code:inputValue
    },
        {
            headers: {
                'Authorization': `Token ${tokenId}`
    
            }
        }
    )
}


export const createPaymentIntent =(paymentMethod,sessionId) =>{
    
    const tokenId = localStorage.getItem('tokennn');
    return axios.post(`${ApiURL}/create-payment-intent/`, {
        payment_method_id:paymentMethod,
        session_id :sessionId
    },
        {
            headers: {
                'Authorization': `Token ${tokenId}`
    
            }
        }
    )
}


export const getOverviewData =(loanId) =>{
    const tokenId = localStorage.getItem('tokennn');
    return axios.get(`${ApiURL}/loan/`, {
        params: { loan_id: loanId},
        headers: {
            'Authorization': `Token ${tokenId}`

        },
        withCredentials: true
    });
}



export const postSavePayment =(session_id) =>{
    console.log(session_id,"session_id");
    
    const tokenId = localStorage.getItem('tokennn');
    return axios.post(`${ApiURL}/save-payment-details/`, {
        session_id:session_id,
    },
        {
            headers: {
                'Authorization': `Token ${tokenId}`
    
            }
        }
    )
}

export const exportBudget = (value, loanId) => {
    const tokenId = localStorage.getItem('tokennn');
    return axios.get(`${ApiURL}/export-budget/`, {
        params: { 
            file_format: value,
            loan_id: loanId
        },
        headers: {
            'Authorization': `Token ${tokenId}`,
            // 'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        },
        responseType: 'blob' // Correctly receive as binary
    });
};


export const getExpenditureGraph = (value, loanId) => {
    const tokenId = localStorage.getItem('tokennn');
    return axios.get(`${ApiURL}/dashboard-graph/`, {
        params: { 
            graph_name: value,
            loan_id: loanId
        },
        headers: {
            'Authorization': `Token ${tokenId}`
        }
    });
}



export const getDocumentRetrive = (  loanId) => {
    const tokenId = localStorage.getItem('tokennn');
    return axios.get(`${ApiURL}/documenttypes-retrieve/`, {
        params: { 
            loan_id: loanId
        },
        headers: {
            'Authorization': `Token ${tokenId}`
        }
    });
}



export const retrieveComments = (  documentCommentId) => {
    const tokenId = localStorage.getItem('tokennn');
    return axios.get(`${ApiURL}/retrieve-comment/`, {
        params: { 
            document_id: documentCommentId
        },
        headers: {
            'Authorization': `Token ${tokenId}`
        }
    });
}



export const insertComment =(newComment,documentCommentId) =>{
    
    const tokenId = localStorage.getItem('tokennn');
    return axios.post(`${ApiURL}/insert-comment/`, {
        document_id:documentCommentId,
        comment:newComment
    },
        {
            headers: {
                'Authorization': `Token ${tokenId}`
    
            }
        }
    )
}




export const uploadFileDrawHistory = (formData) => {
  const tokenId = localStorage.getItem('tokennn');

  return axios.post(`${ApiURL}/draw-document/`, formData, {
    headers: {
      'Authorization': `Token ${tokenId}`,
      'Content-Type': 'multipart/form-data',
    },
  });
};


export const getFileList = (  loan_id,drawRequest) => {
    const tokenId = localStorage.getItem('tokennn');
    return axios.get(`${ApiURL}/list-draw-documents/`, {
        params: { 
            loan_id: loan_id,
            draw_request:drawRequest
        },
        headers: {
            'Authorization': `Token ${tokenId}`
        }
    });
}


export const getViewFileDrawRequest = (  file_id,id) => {
    const tokenId = localStorage.getItem('tokennn');
    return axios.get(`${ApiURL}/draw-document/`, {
        params: { 
            id: id,
            file_id:file_id,
        },
        headers: {
            'Authorization': `Token ${tokenId}`
        }
    });
}

export const deleteFileDrawHistory =(id)=>{

    const tokenId = localStorage.getItem('tokennn');
    console.log(tokenId, "APITOKENID");

    return axios.delete(
        `${ApiURL}/draw-document/${id}`,
        {
            headers: {
                'Authorization': `Token ${tokenId}`,
            },
        }
    );
}




export const drawDocumentStatus = (status,documentId) => {
    const tokenId = localStorage.getItem('tokennn');
  
    return axios.post(`${ApiURL}/draw-document-status/`, {
        status_action:status,
        draw_document_id: documentId
    }, {
      headers: {
        'Authorization': `Token ${tokenId}`,
      },
    });
  };

  

  export const deleteDrawTracking =(id)=>{

    const tokenId = localStorage.getItem('tokennn');
    console.log(tokenId, "APITOKENID");

    return axios.delete(
        `${ApiURL}/draw-tracking/${id}`,
        {
            headers: {
                'Authorization': `Token ${tokenId}`,
            },
        }
    );
}

export const logOut = () => {
    const tokenId = localStorage.getItem('tokennn');
  
    return axios.post(`${ApiURL}/logout/`, {},
        {
      headers: {
        'Authorization': `Token ${tokenId}`,
      },
});
};



export const getListOfUses = () => {
    const tokenId = localStorage.getItem('tokennn');
    return axios.get(`${ApiURL}/usesmapping/`, {
        headers: {
            'Authorization': `Token ${tokenId}`
        }
    });
}





export const deleteUses =(id)=>{

    const tokenId = localStorage.getItem('tokennn');
    console.log(tokenId, "APITOKENID");

    return axios.delete(
        `${ApiURL}/usesmapping/${id}`,
        {
            headers: {
                'Authorization': `Token ${tokenId}`,
            },
        }
    );
}


export const updateUses = (checkLock,Uses,itemId) => {
    const tokenId = localStorage.getItem('tokennn'); 
  
    return axios.put(`${ApiURL}/usesmapping/${itemId}`, {
        is_locked:checkLock,
        uses:Uses
    },
        {
            headers: {
                'Authorization': `Token ${tokenId}`
    
            }
        }
   
);
  };

  

export const postAddUses = (projectType, usesType, uses, checkLock) => {
    const tokenId = localStorage.getItem('tokennn');
    


    return axios.post(
        `${ApiURL}/usesmapping/`, 
        {
            project_type: projectType,
            uses_type: usesType,
            uses: uses,
            is_locked: checkLock,
        },
        {
            headers: {
                Authorization: `Token ${tokenId}`,
            },
            withCredentials: true,
        }
    );
};



export const applyCoupon = (inputValue) => {
    const tokenId = localStorage.getItem('tokennn');
    


    return axios.post(
        `${ApiURL}/validate-promo-code/`, 
        {
            promo_code: inputValue,
        },
        {
            headers: {
                Authorization: `Token ${tokenId}`,
            },
            withCredentials: true,
        }
    );
};



export const getListOfSubscription = () => {
    const tokenId = localStorage.getItem('tokennn');
    return axios.get(`${ApiURL}/retrieve-subscription/`, {
        headers: {
            'Authorization': `Token ${tokenId}`
        }
    });
}


export const handleDeleteSubscription =(id)=>{

    const tokenId = localStorage.getItem('tokennn');
    console.log(tokenId, "APITOKENID");

    return axios.delete(
        `${ApiURL}/delete-subscription/${id}`,
        {
            headers: {
                'Authorization': `Token ${tokenId}`,
            },
        }
    );
}




export const postInsertSubscription = (formData) => {
    const tokenId = localStorage.getItem('tokennn');
    


    return axios.post(
        `${ApiURL}/insert-subscription/`, 
        {
            tier: formData.tier,
            loan_count:formData.loan_count,
            created_at:formData.created_at,
            updated_at:formData.updated_at,
            is_active:formData.is_active
        },
        {
            headers: {
                Authorization: `Token ${tokenId}`,
            },
            withCredentials: true,
        }
    );
};



export const putSubscriptionPlan = (fromData,itemId)=>{
    
    const tokenId = localStorage.getItem('tokennn');
    return axios.put(`${ApiURL}/update-subscription/${itemId}`, {
        tier:fromData.tier,
        loan_count:fromData.loan_count,
        risk_metrics:fromData.risk_metrics

    },
        {
            headers: {
                'Authorization': `Token ${tokenId}`
    
            }
        }
   
);
}


export const getDocumentList = (loanId) => {
    const tokenId = localStorage.getItem('tokennn');
    return axios.get(`${ApiURL}/drawdocuments-checklistview/`, {
        params: { loan_id: loanId},
        headers: {
            'Authorization': `Token ${tokenId}`
        }
    });
}

