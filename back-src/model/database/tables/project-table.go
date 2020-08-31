package tables

import (
	"back-src/model/existence"
	"github.com/go-pg/pg"
)

type ProjectTable struct {
	*pg.DB
}

func (table *ProjectTable) GetFreelancerUsernameByProjectId(projectId string) (string, error) {
	project := existence.Project{}
	if err := table.Model(&project).Where("id = ?", projectId).Column("freelancer_username").Select(); err != nil {
		return "", err
	}
	return project.FreelancerUsername, nil
}

func (table *ProjectTable) GetEmployerUsernameByProjectId(projectId string) (string, error) {
	project := existence.Project{}
	if err := table.Model(&project).Where("id = ?", projectId).Column("employer_username").Select(); err != nil {
		return "", err
	}
	return project.EmployerUsername, nil
}

func (table *ProjectTable) AddProject(project existence.Project) error {
	if _, err := table.Model(&project).Insert(); err != nil {
		return err
	}
	return nil
}