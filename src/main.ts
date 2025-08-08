import { Component } from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
import { provideRouter, Router, RouterOutlet } from "@angular/router";
import { CommonModule } from "@angular/common";
import { LoginComponent } from "./components/login/login.component";
import { MainLayoutComponent } from "./components/main-layout/main-layout.component";
import { AuthGuard } from "./guards/auth.guard";
import { AuthService } from "./services/auth.service";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: "<router-outlet></router-outlet>",
})
export class App {
  constructor(private authService: AuthService, private router: Router) {
    // Redirect to appropriate route on app start
    if (this.authService.isLoggedIn) {
      this.router.navigate(["/chat"]);
    } else {
      this.router.navigate(["/login"]);
    }
  }
}

const routes: any = [
  { path: "", redirectTo: "/login", pathMatch: "full" },
  { path: "login", component: LoginComponent },
  { path: "chat", component: MainLayoutComponent, canActivate: [AuthGuard] },
  { path: "**", redirectTo: "/login" },
];

bootstrapApplication(App, {
  providers: [provideRouter(routes)],
});
