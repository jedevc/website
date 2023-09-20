package main

import (
	"context"
)

type Website struct{}

func (m *Website) Build(
	ctx context.Context,
	source *Directory,
	baseURL string, // +optional
) *Directory {
	npm := dag.Npm().NodeModules
	hugo := func(dir *Directory) *Directory {
		return dag.Hugo().Build(dir, HugoBuildOpts{
			HugoVersion:     "latest",
			DartSassVersion: "latest",
			Minify:          true,
			BaseURL:         baseURL,
		})
	}

	return source.With(npm).With(hugo)
}
