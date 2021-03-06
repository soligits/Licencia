package handle

import (
	licnecia_errors "back-src/controller/control/licencia-errors"
	"back-src/controller/control/projects/fields"
	"back-src/controller/control/projects/filters"
	"back-src/model/existence"
	redis_sessions "back-src/model/redis-sessions"
	"back-src/model/sql"
	"back-src/view/api/handle/utils"
	"back-src/view/notifications"
	"fmt"
	"github.com/gin-gonic/gin"
	"strconv"
	"time"
)

type Handler struct {
}

const notUsedExpiry = 10
const authExpiryMin = 30

var AuthExpiryDur time.Duration

var SqlDb *sql.Database
var RedisApi *redis_sessions.RedisApi

var TokensWithClocks map[string]*utils.Clock

func NewHandler() *Handler {
	var error error
	AuthExpiryDur, error = time.ParseDuration(strconv.Itoa(authExpiryMin) + "m")
	if error != nil {
		panic(error)
	}
	SqlDb = sql.NewDb()
	RedisApi = redis_sessions.NewRedisApi()
	err := SqlDb.Initialize()
	if err != nil {
		panic(err)
	}
	filters.Inv = filters.NewEngine(SqlDb)
	fields.Engine = fields.NewEngine(SqlDb)
	initTokensWithClocks()
	return &Handler{}
}

func initTokensWithClocks() {
	TokensWithClocks = map[string]*utils.Clock{}
	if auths, err := RedisApi.AuthTokenDB.GetAllTokens(); err == nil {
		for _, auth := range auths {
			AddNewClock(auth.Token)
		}
	} else {
		fmt.Println("ERROR:", "Server Could Not Init Previous Auth Tokens")
	}
}

func AddNewClock(token string) {
	clk := utils.NewClock(true, notUsedExpiry, func() {
		if err := RedisApi.AuthTokenDB.ExpireAuth(token); err != nil {
			panic(err)
		}
	})
	clk.Start()
	TokensWithClocks[token] = clk
}

func KillClockIfExists(token string) bool {
	clock, ok := TokensWithClocks[token]
	if ok {
		clock.Stop()
	}
	delete(TokensWithClocks, token)
	return ok
}

func makeOperationErrorNotification(ctx *gin.Context, err error) notifications.Notification {
	if licnecia_errors.IsLicenciaError(err) {
		return notifications.GetExpectationFailedError(ctx, licnecia_errors.GetErrorStrForRespond(err), nil)
	} else {
		panic(err)
		return notifications.GetInternalServerErrorNotif(ctx, nil)
	}
}

func getAuthByContext(ctx *gin.Context) existence.AuthToken {
	auth, _ := RedisApi.AuthTokenDB.GetAuthByToken(ctx.Writer.Header().Get("Token"))
	return auth
}

func getUsernameByContextToken(ctx *gin.Context) string {
	username, _ := RedisApi.AuthTokenDB.GetUsernameByToken(ctx.Writer.Header().Get("Token"))
	return username
}
