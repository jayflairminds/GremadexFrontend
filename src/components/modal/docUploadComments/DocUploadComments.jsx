import { Modal, Input } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import stylesModal from "./DocUploadComments.module.css";
import { insertComment, retrieveComments } from '../../../services/api';
import { ArrowRightOutlined, LoadingOutlined } from '@ant-design/icons';
import { Loader } from '../../loader/Loder';

export const DocUploadComments = ({ isCommentModal, setIsCommentModal, documentCommentId,documentNameSub,documentTypeSub }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const commentsEndRef = useRef(null); // Reference for auto-scrolling

  // Fetch comments for the document
  const handleComments = async () => {
    setLoading(true)
    try {
      const response = await retrieveComments(documentCommentId);
      setComments(response.data);
      console.log(response, "comments");
    } catch (err) {
      console.log(err);
      // message.error(err);
    }finally{
        setLoading(false)
    }
  };

  useEffect(() => {
    handleComments();
  }, [documentCommentId]);

  // Auto-scroll to the latest comment
  useEffect(() => {
    commentsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [comments]);

  const handleOk = () => {
    setIsCommentModal(false);
  };

  const handleCancel = () => {
    setIsCommentModal(false);
  };

  const role = localStorage.getItem('RoleType');

  // Function to handle submitting the new comment
  const handleSendMessage = async () => {
    if (newComment.trim()) {
      try {
        const response = await insertComment(newComment, documentCommentId);
        console.log(response);
        if (response.status === 201) {
          handleComments(); // Refresh comments after successful insertion
        }
      } catch (err) {
        console.log(err);
      } finally {
        setNewComment(""); // Clear the input field
      }
    }
  };

  return (
    <div>
      <Modal
         title={` ${documentNameSub} (${documentTypeSub})`}
        open={isCommentModal}
        onOk={handleOk}
        onCancel={handleCancel}
        centered
        footer={null}
        width={650}
      >
        <div>
          {loading ? ( 
            <div className={stylesModal.loaderDiv}>
              <Loader />
            </div>
          ) : (
            <>
                <div className={stylesModal.messageInputContainer}>
                <Input
                  placeholder="Enter Comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onPressEnter={handleSendMessage}
                  className={stylesModal.messageInput}
                  style={{ color: "black" }}
                />
                
                {/* Arrow icon button with loading state */}
                <div className={stylesModal.arrowDiv} onClick={handleSendMessage}>
                  {loading ? (
                    <LoadingOutlined className={stylesModal.icon} />
                  ) : (
                    <ArrowRightOutlined style={{ paddingLeft: "0.5rem" }} className={stylesModal.icon} />
                  )}
                </div>
              </div>
              <div className={stylesModal.commentsContainer}>
              {comments && comments.length > 0 ? (
                comments.map((comment) => (
                  <div
                    key={comment.id}
                    className={`${stylesModal.commentBubble} ${
                      comment.role_type === role ? stylesModal.rightBubble : stylesModal.leftBubble
                    }`}
                  >
                   <div className={stylesModal.name}>
                   {(comment.role_type === "inspector" ? "servicer" : comment.role_type)
                    .charAt(0).toUpperCase() + (comment.role_type === "inspector" ? "servicer" : comment.role_type).slice(1)}

                  </div>
                    <div className={stylesModal.commentText}>{comment.comment}</div>
                    <div className={stylesModal.commentMeta}>
                      {new Date(comment.created_at).toLocaleTimeString()}
                    </div>
                  </div>
                ))
              ) : (
                <div className={stylesModal.noComments}>No comments</div>
              )}
              {/* Div to ensure scrolling to the bottom */}
              <div ref={commentsEndRef} />
                          </div>


              {/* Input field for new message */}
              
            </>
          )}
        </div>
      </Modal>
    </div>
  );
};
