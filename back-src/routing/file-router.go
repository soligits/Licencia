package routing

import (
	"back-src/model/existence"
	"back-src/view/api/handle"
	"back-src/view/api/respond"
	limits "github.com/gin-contrib/size"
	"github.com/gin-gonic/gin"
)

func (router *router) addFileEndpoints() {
	router.addNewEndpointGroup("/files", "files", "")
	router.addNewEndpointGroup("/profile-pic", "profile-pic", "files").group.Use(
		limits.RequestSizeLimiter(handle.MaxProfileImageSizeInBytes),
		limits.AbortIfTooLarge(handle.ProfileImageUploaderForName, limits.FileFormType),
	)
	router.addNewEndpointGroup("/project", "project-files", "files")
	router.addNewEndpointGroup("/employer", "employer-project-files", "project-files").addCheckToken(existence.EmployerType)
	router.addNewEndpointGroup("/general", "general-project-files", "project-files").addCheckTokenIgnoreType()
	router.addNewEndpointGroup("/freelancer", "freelancer-profile-pic", "profile-pic").addCheckToken(existence.FreelancerType)
	router.addNewEndpointGroup("/employer", "employer-profile-pic", "profile-pic").addCheckToken(existence.EmployerType)

	router.addHandlerToPath("/upload", "freelancer-profile-pic", Post, func(context *gin.Context) {
		respond.Respond(router.handler.UploadProfileImage(context, existence.FreelancerProfile))
	})

	router.addHandlerToPath("/upload", "employer-profile-pic", Post, func(context *gin.Context) {
		respond.Respond(router.handler.UploadProfileImage(context, existence.EmployerProfile))
	})

	router.addHandlerToPath("/upload", "freelancer-profile-pic", Delete, func(context *gin.Context) {
		respond.Respond(router.handler.DeleteProfileImage(context, existence.FreelancerType))
	})

	router.addHandlerToPath("/download", "freelancer-profile-pic", Get, func(context *gin.Context) {
		respond.Respond(router.handler.DownloadProfileImage(context, existence.FreelancerProfile))
	})

	router.addHandlerToPath("/download", "employer-profile-pic", Get, func(context *gin.Context) {
		respond.Respond(router.handler.DownloadProfileImage(context, existence.EmployerProfile))
	})

	router.addHandlerToPath("/download", "general-project-files", Get, func(context *gin.Context) {
		respond.Respond(router.handler.DownloadProjectFile(context))
	})

	router.addHandlerToPath("/upload", "employer-project-files", Post, func(context *gin.Context) {
		respond.Respond(router.handler.UploadProjectFile(context))
	})

	router.addHandlerToPath("/update", "employer-project-files", Post, func(context *gin.Context) {
		respond.Respond(router.handler.UpdateProjectFile(context))
	})

	router.addHandlerToPath("/remove", "employer-project-files", Post, func(context *gin.Context) {
		respond.Respond(router.handler.RemoveProjectFile(context))
	})
}
