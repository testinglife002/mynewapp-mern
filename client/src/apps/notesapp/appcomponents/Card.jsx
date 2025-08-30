// src/appcomponents/Card.jsx
import { useState } from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
 import Content from "./Content";
 import ContentModal from "./ContentModal";


function Card({ title, blocks, projectId, projectName, isPublic, createdBy, user, createdUsername, idx, onEdit, onDelete, onShare, readonly }) {
  const currentUser = user;
  // const isOwner = currentUser && currentUser?._id === createdBy;
  const isOwner = currentUser && currentUser?._id === createdBy?._id;
  // console.log(idx,title,projectId,projectName,createdBy,user);
  const [showModal, setShowModal] = useState(false);

    // Limit preview height/width
  const contentPreviewStyle = {
    maxHeight: "300px",
    maxWidth: "70%",
    overflow: "hidden",
    position: "relative",
  };

  return (
    <div className="card mb-3 shadow-sm" style={{ minHeight: "200px", maxHeight: "250px", width:'250px' }}>
      <div className="card-header py-1 px-2 d-flex justify-content-between align-items-center">
        <small className="text-truncate" style={{ maxWidth: "80%" }}>
          <strong>{createdBy?.username || createdUsername || "Unknown"}</strong>
        </small>
        <span className={`badge ${isPublic ? "bg-success" : "bg-secondary"}`}>
          {isPublic ? "Public" : "Private"}
        </span>
      </div>

      <div >
        <h6 className="fw-bold text-truncate mt-1" title={title}>
          {title}
          
          <Link className="pull-right p-1" to={`/notes/${idx}`}>Show</Link>
        </h6>
        <div className="text-muted small mb-1">Project: {projectId?.name}</div>

        {/*<div style={contentPreviewStyle} className=" small" >
           blocks && blocks.length > 0 && parse(blocks[0].data.text || "")
          <div  style={{ maxHeight: "110px", maxWidth:'90%', overflow: "hidden" }}>
            {blocks?.slice(0, 3).map((block, i) => (
              <Content block={block} key={block.id || i} />
            ))}
            {blocks?.length > 3 && <span className="text-muted">...read more</span>}
          </div>
        </div> */}

        {/* inside Card.jsx, replace the content preview div */}

        <div style={contentPreviewStyle} className="small">
          <div style={{ maxHeight: "110px", maxWidth: '90%', overflow: "hidden" }}>
        
            {(() => {
              let previewText = "";
              blocks?.forEach((block) => {
                switch (block.type) {
                  case "paragraph":
                  case "header":
                  case "alert":
                    previewText += (block.data?.text || block.data?.message || "") + " ";
                    break;
                  case "list":
                  case "checklist":
                    if (block.data?.items) {
                      previewText += block.data.items.map((i) => i.text || i).join(" ") + " ";
                    }
                    break;
                  default:
                    break; // ignore images/embeds in preview
                }
              });
              previewText = previewText.trim();
              return (
                <span>
                  {previewText.length > 55
                    ? previewText.substring(0, 55) + "..."
                    : previewText}
                </span>
              );
            })()}
          </div>
        </div> 


       
          
          <div className="modal-footer">
          
              <div className="d-flex flex-wrap mt-2 mb-2 gap-2 px-1">
                {isOwner && (
                  <>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => onEdit(idx)}
                      data-bs-toggle="modal"
                      data-bs-target="#editormodal"
                      >
                      <span className="pe-1">Edit</span>
                      <i className="bi bi-pencil"></i>
                    </button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => onDelete(idx)}
                    >
                      <i className="bi bi-trash me-1"></i>Delete
                    </Button>
                  </>
                )}
                {isOwner && (
                  <button className="btn btn-sm btn-outline-info" onClick={() => onShare(idx)}>Share</button>
                )}

                <Link
                  to={`/notes/${idx}`}
                  className="btn btn-outline-warning btn-sm"
                >
                  <i className="bi bi-eye me-1"></i>View
                </Link>


                {isOwner && (
                  <Button
                    variant="outline-success"
                    size="sm"
                    onClick={() => onCopyToDashboard?.(idx)}
                  >
                    <i className="bi bi-clipboard-plus me-1"></i>Copy to My Notes
                  </Button>
                )}
              </div>
          
          </div>

      
      </div>
      <ContentModal title={title} blocks={blocks} idx={idx} onEdit={onEdit} />
      

    </div>
  );
}
export default Card;

